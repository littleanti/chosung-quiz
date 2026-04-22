# 🔧 TRD — 초성 퀴즈 v2

> Technical Requirements Document

## 1. 기술 스택

| 레이어 | 선택 | 근거 |
|---|---|---|
| 언어 | Vanilla JavaScript (ES2020+) | 의존성 없음, 학습/유지보수 쉬움 |
| 모듈 시스템 | ES Modules (`type="module"`) | 네이티브 지원, 빌드 불필요 |
| CSS | Vanilla CSS + CSS Variables | 간결, 토큰 관리 용이 |
| 폰트 | Google Fonts (Jua, Gowun Dodum) | 한글 아이 친화적 |
| 개발 서버 | `npx serve` 또는 Live Server | zero-config |
| 저장소 | `localStorage` | 설정 영속화, 서버 불필요 |
| TTS | Web Speech API | 네이티브, 설치 불필요 |

**의도적으로 제외한 것**:
- React/Vue 등 프레임워크 — 이 규모에서는 과함
- 빌드 도구 (Vite/Webpack) — ES Modules로 충분
- TypeScript — 프로토타입 속도 우선 (추후 마이그레이션 가능)
- npm 의존성 — `node_modules` 없음, 설치 속도 즉시

## 2. 아키텍처

### 2.1 디렉터리 구조
```
src/
├── css/          # 스타일 (토큰 → 베이스 → 컴포넌트 → 화면 순으로 로드)
├── data/         # 순수 데이터 (단어 DB)
└── js/           # 로직
    ├── main.js           # 진입점 + 전역 노출
    ├── config.js         # 상수 (순수, 의존성 없음)
    ├── state.js          # 전역 상태 싱글톤
    ├── storage.js        # localStorage 래퍼
    ├── utils.js          # 순수 유틸
    ├── tts.js            # Web Speech API
    ├── timer.js          # 카운트다운
    ├── ui.js             # 화면전환 헬퍼
    ├── settings.js       # 설정 화면 렌더링 + 필터링
    └── game.js           # 게임 로직 (출제, 정답, 종료)
```

### 2.2 모듈 의존성
```
main.js
  ├─ storage.js ─→ state.js, config.js, words.js
  ├─ settings.js ─→ state.js, storage.js, tts.js, ui.js, game.js, words.js
  └─ game.js ─→ state.js, utils.js, timer.js, tts.js, ui.js, settings.js

공통 의존:
  config.js (상수, 최하위)
  utils.js ─→ config.js
  state.js ─→ config.js, words.js
  ui.js ─→ utils.js, timer.js, tts.js
```

`settings.js` ↔ `game.js` 간 순환 의존이 있지만, `startFromSettings()`가 `startGame()`을 부르고 `game.js`의 `filterWords` 참조가 `settings.js`에 있기 때문. ES Module에서는 런타임 시점 참조이므로 문제없이 동작.

### 2.3 상태 모델
```js
state = {
  settings: {
    categories: Set<string>,      // 선택된 카테고리
    difficulty: 'all'|'easy'|'medium'|'hard',
    questionCount: 5|10|20,
    timerSeconds: 0|5|10|15,      // 0 = 끔
    ttsEnabled: boolean,
    imageMode: boolean,
  },
  game: {
    questions: Word[],            // 이번 세션 문제들
    currentIdx: number,
    score: number,
    wrongAnswers: Word[],         // + { reason: 'wrong'|'timeout' }
    revealed: boolean,            // 현재 문제가 공개되었나
    timerHandle: IntervalID|null,
    timeLeft: number,             // 초 단위 (소수점 지원)
  }
}
```

### 2.4 화면 상태 머신
```
start ──→ play ──→ end
  │        ↑        │
  ↓        │        ↓
settings ──┘    (다시하기/설정변경)
```

전이 시 부작용:
- 모든 전이 → `stopTimer()` + `cancelSpeech()`
- `settings-screen` 진입 → `renderSettings()` 재호출
- `play-screen` 진입 후 `startGame()` 호출됨

## 3. 핵심 알고리즘

### 3.1 한글 초성 추출
```js
// 한글 유니코드: 가(0xAC00) ~ 힣(0xD7A3)
// 공식: ((코드 - 0xAC00) / 588) = 초성 인덱스
//   588 = 21(중성 개수) × 28(종성 개수)

function getChosung(word) {
  for (const ch of word) {
    const code = ch.charCodeAt(0) - 0xAC00;
    if (code >= 0 && code <= 11171) {
      result += CHOSUNG[Math.floor(code / 588)];
    } else {
      result += ch; // 비한글 문자
    }
  }
}
```

**엣지 케이스**:
- 영문/숫자 혼합 → 그대로 유지
- 이모지 → `for...of`로 surrogate pair 안전 처리
- 자모만 있는 글자 → 유니코드 범위 밖이므로 그대로 출력

### 3.2 문제 풀 구성
```
filterWords(settings) → pool

if (pool.length === 0):      # 필터 결과 없음 (방어)
  questions = shuffle(WORDS).slice(0, needed)
elif (pool.length >= needed):
  questions = shuffle(pool).slice(0, needed)
else:                        # 부족하면 반복 채움
  filled = []
  while len(filled) < needed:
    filled.extend(shuffle(pool))
  questions = filled.slice(0, needed)
```

### 3.3 타이머
- `setInterval(100ms)` + `timeLeft -= 0.1`
- UI 배지 색상: 초록(>60%) → 노랑(30-60%) → 빨강+펄스(<30%)
- 0에 도달하면 `stopTimer()` + `onTimeout()` 콜백 호출
- 콜백에서 `revealAnswer(timedOut=true)` → 오답 기록 → 1.8초 후 다음 문제

## 4. 외부 API

### 4.1 Web Speech API (TTS)
```js
speechSynthesis.speak(new SpeechSynthesisUtterance({
  text, lang: 'ko-KR', rate: 0.85, pitch: 1.05, voice: koVoice
}));
```

**호환성 고려**:
- `'speechSynthesis' in window` 체크
- `voiceschanged` 이벤트로 음성 리스트 비동기 로딩 대기
- `ko-KR` 음성 우선, 없으면 `ko*` 폴백, 없으면 기본 음성
- 미지원 시 설정에서 토글 비활성화 + 힌트 메시지 표시

### 4.2 localStorage
```js
try {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({...settings, categories: [...]}));
} catch (e) { /* ignore */ }
```

Private Browsing 등에서 실패해도 `try/catch`로 무시 → 앱은 정상 동작.

## 5. 렌더링 전략

### 5.1 이미지 모드 (Graceful Fallback)
```js
if (imageMode && imageUrl) {
  const img = createImg(imageUrl);
  img.onerror = () => replaceWithEmoji(emoji); // 로드 실패 시 폴백
} else {
  renderEmoji(emoji);
}
```

### 5.2 DOM 업데이트
- **직접 DOM 조작** (프레임워크 없음)
- 리스트 재렌더는 `innerHTML = ''` 후 `createElement` 루프
- `display: none` 토글로 패널 전환 (리플로우 1회)

## 6. 성능 고려사항

| 영역 | 최적화 |
|---|---|
| 초기 로드 | ES Module은 순차 로드 → 단일 파일 < 10KB씩 분할 |
| 애니메이션 | `transform`/`opacity`만 사용 (compositor layer) |
| 타이머 | `requestAnimationFrame` 대신 100ms 간격 (정확도 충분) |
| 이미지 | `onerror` 폴백으로 실패 처리 비용 최소화 |
| 폰트 | `preconnect`로 DNS 병렬화 |

## 7. 보안

- 사용자 입력 없음 → XSS 표면 작음
- 오답 리스트의 단어는 정적 데이터이므로 `innerHTML` 안전
- 만약 사용자 입력을 받게 된다면 `textContent` 사용 필수

## 8. 테스트 전략

### 수동 테스트 체크리스트
- [ ] 모든 카테고리 해제 → 시작 버튼 클릭 시 플래시 메시지
- [ ] 쉬움 + "귤" 단일 카테고리 → 반복 채움 동작 확인
- [ ] 타이머 5초 → 0초 도달 시 자동 공개 + 오답 처리
- [ ] TTS 미지원 브라우저 (예: 일부 Firefox) → 토글 비활성화
- [ ] 이미지 모드 ON + 잘못된 URL → 이모지 폴백
- [ ] 설정 변경 후 새로고침 → 설정 유지되는지
- [ ] Incognito 모드 → localStorage 실패해도 게임은 동작

### 자동화 (추후)
- Vitest + jsdom으로 `getChosung`, `filterWords`, `shuffle` 유닛 테스트
- Playwright로 주요 시나리오 E2E

## 9. 배포

정적 파일이므로 어디든 호스팅 가능:

| 옵션 | 명령 |
|---|---|
| GitHub Pages | 레포에 `gh-pages` 브랜치 푸시 |
| Netlify | `netlify deploy --dir=.` |
| Vercel | `vercel --prod` |
| Cloudflare Pages | 드래그 앤 드롭 |

빌드 단계 불필요 — 루트 디렉터리 그대로 업로드.
