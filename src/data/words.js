/**
 * 단어 데이터베이스
 *
 * 단어 추가/수정은 이 파일에서만 하면 됩니다.
 *
 * 필드:
 *   - emoji     : 이모지 표현 (필수)
 *   - word      : 한글 단어 (필수)
 *   - category  : 카테고리 (CATEGORIES 중 하나)
 *   - imageUrl? : (선택) 실제 이미지 URL. 사진 모드 ON 시 사용.
 *                 로드 실패 시 emoji로 자동 폴백됩니다.
 */

export const CATEGORIES = ['과일', '동물', '탈것', '음식', '자연'];

export const WORDS = [
  // ===== 과일 =====
  { emoji: '🍎', word: '사과',   category: '과일', imageUrl: './src/images/사과.jpg' },
  { emoji: '🍌', word: '바나나', category: '과일', imageUrl: './src/images/바나나.jpg' },
  { emoji: '🍓', word: '딸기',   category: '과일', imageUrl: './src/images/딸기.jpg' },
  { emoji: '🍉', word: '수박',   category: '과일', imageUrl: './src/images/수박.jpg' },
  { emoji: '🍇', word: '포도',   category: '과일', imageUrl: './src/images/포도.jpg' },
  { emoji: '🍑', word: '복숭아', category: '과일', imageUrl: './src/images/복숭아.jpg' },
  { emoji: '🍊', word: '귤',     category: '과일', imageUrl: './src/images/귤.jpg' },
  { emoji: '🥝', word: '키위',   category: '과일', imageUrl: './src/images/키위.jpg' },

  // ===== 동물 =====
  { emoji: '🐶', word: '강아지', category: '동물' },
  { emoji: '🐱', word: '고양이', category: '동물' },
  { emoji: '🐯', word: '호랑이', category: '동물' },
  { emoji: '🦁', word: '사자', category: '동물' },
  { emoji: '🐘', word: '코끼리', category: '동물' },
  { emoji: '🐰', word: '토끼', category: '동물' },
  { emoji: '🐼', word: '판다', category: '동물' },
  { emoji: '🐵', word: '원숭이', category: '동물' },
  { emoji: '🐸', word: '개구리', category: '동물' },
  { emoji: '🦒', word: '기린', category: '동물' },
  { emoji: '🐙', word: '문어', category: '동물' },

  // ===== 탈것 =====
  { emoji: '🚗', word: '자동차', category: '탈것' },
  { emoji: '✈️', word: '비행기', category: '탈것' },
  { emoji: '🚂', word: '기차', category: '탈것' },
  { emoji: '🚲', word: '자전거', category: '탈것' },
  { emoji: '🚢', word: '배', category: '탈것' },
  { emoji: '🚌', word: '버스', category: '탈것' },
  { emoji: '🚁', word: '헬리콥터', category: '탈것' },
  { emoji: '🛵', word: '오토바이', category: '탈것' },

  // ===== 음식 =====
  { emoji: '🍕', word: '피자', category: '음식' },
  { emoji: '🍔', word: '햄버거', category: '음식' },
  { emoji: '🍦', word: '아이스크림', category: '음식' },
  { emoji: '🍜', word: '라면', category: '음식' },
  { emoji: '🍗', word: '치킨', category: '음식' },
  { emoji: '🥐', word: '크루아상', category: '음식' },
  { emoji: '🍩', word: '도넛', category: '음식' },
  { emoji: '🍱', word: '김밥', category: '음식' },

  // ===== 자연 =====
  { emoji: '🌈', word: '무지개', category: '자연' },
  { emoji: '🌙', word: '달', category: '자연' },
  { emoji: '⭐', word: '별', category: '자연' },
  { emoji: '🌸', word: '꽃', category: '자연' },
  { emoji: '🌳', word: '나무', category: '자연' },
  { emoji: '☀️', word: '해', category: '자연' },
  { emoji: '☁️', word: '구름', category: '자연' },
  { emoji: '🌻', word: '해바라기', category: '자연' },
  { emoji: '🌊', word: '바다', category: '자연' },
];
