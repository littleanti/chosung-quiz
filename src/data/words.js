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
  { emoji: '🍎', word: '사과',   category: '과일', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/320px-Red_Apple.jpg' },
  { emoji: '🍌', word: '바나나', category: '과일', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Bananas.jpg/320px-Bananas.jpg' },
  { emoji: '🍓', word: '딸기',   category: '과일', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Garden_strawberry_%28Fragaria_%C3%97_ananassa%29_single2.jpg/240px-Garden_strawberry_%28Fragaria_%C3%97_ananassa%29_single2.jpg' },
  { emoji: '🍉', word: '수박',   category: '과일', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Watermelon_seedless_%28protacorp%29.jpg/320px-Watermelon_seedless_%28protacorp%29.jpg' },
  { emoji: '🍇', word: '포도',   category: '과일' },
  { emoji: '🍑', word: '복숭아', category: '과일' },
  { emoji: '🍊', word: '귤',     category: '과일' },
  { emoji: '🥝', word: '키위',   category: '과일' },

  // ===== 동물 =====
  { emoji: '🐶', word: '강아지', category: '동물', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/YellowLabradorLooking_new.jpg/320px-YellowLabradorLooking_new.jpg' },
  { emoji: '🐱', word: '고양이', category: '동물', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/320px-Cat_November_2010-1a.jpg' },
  { emoji: '🐯', word: '호랑이', category: '동물', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/320px-Walking_tiger_female.jpg' },
  { emoji: '🦁', word: '사자',   category: '동물', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/320px-Lion_waiting_in_Namibia.jpg' },
  { emoji: '🐘', word: '코끼리', category: '동물', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/320px-African_Bush_Elephant.jpg' },
  { emoji: '🐰', word: '토끼',   category: '동물' },
  { emoji: '🐼', word: '판다',   category: '동물' },
  { emoji: '🐵', word: '원숭이', category: '동물' },
  { emoji: '🐸', word: '개구리', category: '동물' },
  { emoji: '🦒', word: '기린',   category: '동물' },
  { emoji: '🐙', word: '문어',   category: '동물' },

  // ===== 탈것 =====
  { emoji: '🚗', word: '자동차',   category: '탈것' },
  { emoji: '✈️', word: '비행기',   category: '탈것' },
  { emoji: '🚂', word: '기차',     category: '탈것' },
  { emoji: '🚲', word: '자전거',   category: '탈것' },
  { emoji: '🚢', word: '배',       category: '탈것' },
  { emoji: '🚌', word: '버스',     category: '탈것' },
  { emoji: '🚁', word: '헬리콥터', category: '탈것' },
  { emoji: '🛵', word: '오토바이', category: '탈것' },

  // ===== 음식 =====
  { emoji: '🍕', word: '피자',       category: '음식', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg' },
  { emoji: '🍔', word: '햄버거',     category: '음식' },
  { emoji: '🍦', word: '아이스크림', category: '음식' },
  { emoji: '🍜', word: '라면',       category: '음식' },
  { emoji: '🍗', word: '치킨',       category: '음식' },
  { emoji: '🥐', word: '크루아상',   category: '음식' },
  { emoji: '🍩', word: '도넛',       category: '음식' },
  { emoji: '🍱', word: '김밥',       category: '음식' },

  // ===== 자연 =====
  { emoji: '🌈', word: '무지개',   category: '자연' },
  { emoji: '🌙', word: '달',       category: '자연' },
  { emoji: '⭐', word: '별',       category: '자연' },
  { emoji: '🌸', word: '꽃',       category: '자연' },
  { emoji: '🌳', word: '나무',     category: '자연' },
  { emoji: '☀️', word: '해',       category: '자연' },
  { emoji: '☁️', word: '구름',     category: '자연' },
  { emoji: '🌻', word: '해바라기', category: '자연' },
  { emoji: '🌊', word: '바다',     category: '자연' },
];
