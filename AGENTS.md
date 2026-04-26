<!-- Generated: 2026-04-25 | Updated: 2026-04-25 -->

# chosung-quiz

## Purpose
초성 퀴즈 웹 게임. 이모지(또는 사진)를 보고 한글 단어의 초성을 맞히는 교육용 게임으로, 미취학 아동 대상의 한글 학습을 목적으로 한다. Vanilla JS + CSS 기반, 빌드 도구 없음.

## Key Files

| File | Description |
|------|-------------|
| `index.html` | 앱 전체 HTML — 4개 화면(start/settings/play/end)이 단일 파일에 존재 |
| `package.json` | dev 서버 스크립트만 정의 (`npm run dev` → npx serve :3001) |
| `favicon.svg` | SVG 파비콘 |
| `CLAUDE.md` | Claude Code용 프로젝트 가이드 (아키텍처, 명령어, 구현 노트) |
| `README.md` | 프로젝트 소개 |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `src/` | 소스코드 전체 (see `src/AGENTS.md`) |
| `docs/` | 기획/설계 문서 (see `docs/AGENTS.md`) |

## Screen State Machine

```
start ──→ play ──→ end
  │        ↑        │
  ↓        │        ↓
settings ──┘    (replay/settings)
```

모든 화면 전환은 `src/js/ui.js`의 `goTo(screenName)`를 통해 이루어지며, 전환 시 항상 타이머 정지 + TTS 중단 처리가 포함된다.

## For AI Agents

### Working In This Directory
- 런타임 npm 의존성 없음. `package.json`은 dev 서버 스크립트만 보유.
- HTML `onclick="..."` 패턴 사용 — JS에서 이벤트 리스너를 직접 붙이지 않음. 새 버튼 추가 시 `main.js`에서 `window.함수명 = 함수명` 노출 필요.
- ES Modules 사용 — 브라우저가 직접 import. `file://`로 열면 CORS 오류 발생하므로 반드시 dev 서버 사용.

### Testing Requirements
- `npm run dev` 실행 후 http://localhost:3000 에서 수동 테스트
- 자동화 테스트 없음 (docs/TRD.md §8 수동 체크리스트 참조)

### Common Patterns
- 단일 전역 state 객체 (`src/js/state.js`)
- localStorage 영속화는 `src/js/storage.js`에서만 처리
- 단어 데이터 추가/수정은 `src/data/words.js` 에서만

## Dependencies

### External
- `npx serve` — 로컬 정적 파일 서버 (devDependency, 설치 불필요)

<!-- MANUAL: -->
