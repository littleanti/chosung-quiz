/**
 * 게임 로직
 * - 문제 출제, 정답 처리, 종료 화면
 */

import { CHOSUNG, TIMEOUT_REVEAL_DURATION } from './config.js';
import { state, resetGame } from './state.js';
import { WORDS } from '../data/words.js';
import { getChosung, shuffle, $, $$ } from './utils.js';
import { startTimer, stopTimer, hideTimer } from './timer.js';
import { TTS_AVAILABLE, speak } from './tts.js';
import { playCorrect, playIncorrect } from './sound.js';
import { goTo } from './ui.js';
import { filterWords } from './settings.js';

const INPUT_CORRECT_DELAY = 1200;
const INPUT_WRONG_DELAY   = 2000;

/**
 * 게임 시작: 문제 풀 구성 → 첫 문제 로드
 */
export function startGame() {
  const pool = filterWords(state.settings);
  const needed = state.settings.questionCount;

  let questions;
  if (pool.length === 0) {
    // 필터 결과 0개 방어 - 전체 단어로 대체
    questions = shuffle(WORDS).slice(0, needed);
  } else if (pool.length >= needed) {
    questions = shuffle(pool).slice(0, needed);
  } else {
    // 부족하면 반복해서 채움
    const filled = [];
    while (filled.length < needed) {
      filled.push(...shuffle(pool));
    }
    questions = filled.slice(0, needed);
  }

  resetGame();
  state.game.questions = questions;

  $('#total-num').textContent = questions.length;
  goTo('play-screen');
  loadQuestion();
}

/**
 * 현재 인덱스의 문제를 화면에 표시
 */
export function loadQuestion() {
  state.game.revealed = false;
  const q = state.game.questions[state.game.currentIdx];
  if (!q) {
    endGame();
    return;
  }

  $('#current-num').textContent = state.game.currentIdx + 1;
  $('#score').textContent = state.game.score;
  $('#category').textContent = q.category;

  renderVisual(q);

  // 초성 표시
  const wordEl = $('#word');
  wordEl.textContent = getChosung(q.word);
  wordEl.classList.remove('revealed');

  // TTS 버튼
  const ttsBtn = $('#tts-btn');
  ttsBtn.style.display = (TTS_AVAILABLE && state.settings.ttsEnabled) ? 'inline-block' : 'none';

  // 입력 모드 분기
  if (state.settings.inputMode) {
    $('#chosung-input-area').style.display = 'flex';
    $('#check-row').style.display = 'none';
    $('#result-row').style.display = 'none';
    renderChosungSlots(q.word);
  } else {
    $('#chosung-input-area').style.display = 'none';
    $('#check-row').style.display = 'flex';
    $('#result-row').style.display = 'none';
  }

  // 진행바
  const pct = (state.game.currentIdx / state.game.questions.length) * 100;
  $('#progress-fill').style.width = pct + '%';

  // 타이머
  if (state.settings.timerSeconds > 0) {
    startTimer(state.settings.timerSeconds, () => revealAnswer(true));
  } else {
    hideTimer();
  }
}

/**
 * 비주얼 영역 (이미지 또는 이모지)
 */
function renderVisual(q) {
  const visual = $('#visual-area');
  visual.innerHTML = '';

  if (state.settings.imageMode && q.imageUrl) {
    const img = document.createElement('img');
    img.className = 'image-display';
    img.src = q.imageUrl;
    img.alt = q.word;
    img.onerror = () => {
      // 이미지 로드 실패 시 이모지로 폴백
      visual.innerHTML = '';
      appendEmoji(visual, q.emoji);
    };
    visual.appendChild(img);
  } else {
    appendEmoji(visual, q.emoji);
  }
}

function appendEmoji(container, emoji) {
  const span = document.createElement('span');
  span.className = 'emoji-display';
  span.textContent = emoji;
  container.appendChild(span);
}

/**
 * 정답 공개
 * @param {boolean} timedOut - 타이머 초과로 공개된 경우 true
 */
export function revealAnswer(timedOut) {
  if (state.game.revealed) return;
  state.game.revealed = true;
  stopTimer();

  const q = state.game.questions[state.game.currentIdx];
  const wordEl = $('#word');
  wordEl.textContent = q.word;
  wordEl.classList.add('revealed');

  $('#check-row').style.display = 'none';
  $('#chosung-input-area').style.display = 'none';

  if (timedOut) {
    // 시간 초과: 오답 처리 후 잠시 보여주고 자동 이동
    state.game.wrongAnswers.push({ ...q, reason: 'timeout' });
    playIncorrect();
    if (state.settings.ttsEnabled) speak(q.word);
    setTimeout(advance, TIMEOUT_REVEAL_DURATION);
  } else {
    $('#result-row').style.display = 'flex';
    if (state.settings.ttsEnabled) speak(q.word);
  }
}

/**
 * 다음 문제로 이동 (또는 종료)
 */
function advance() {
  state.game.currentIdx++;
  if (state.game.currentIdx >= state.game.questions.length) {
    endGame();
  } else {
    loadQuestion();
  }
}

/**
 * 사용자가 맞혔음/틀렸음 선택
 */
export function markAnswer(correct) {
  const q = state.game.questions[state.game.currentIdx];
  if (correct) {
    state.game.score++;
    $('#score').textContent = state.game.score;
    playCorrect();
  } else {
    state.game.wrongAnswers.push({ ...q, reason: 'wrong' });
    playIncorrect();
  }
  advance();
}

/**
 * 현재 문제 TTS 재생 (HTML onclick에서 호출)
 */
export function speakCurrent() {
  const q = state.game.questions[state.game.currentIdx];
  if (q) speak(q.word, $('#tts-btn'));
}

/**
 * 게임 중 중단 — 현재까지의 결과로 종료 화면 표시
 */
export function quitGame() {
  stopTimer();
  state.game.questions = state.game.questions.slice(0, state.game.currentIdx);
  endGame();
}

/**
 * 종료 화면
 */
export function endGame() {
  stopTimer();
  const total = state.game.questions.length;
  const score = state.game.score;
  const pct   = total > 0 ? score / total : 0;

  const { title, emojis } = getEndingMessage(pct);

  $('#end-title').textContent    = title;
  $('#celebrate').textContent    = emojis;
  $('#final-score').textContent  = score;
  $('#final-total').textContent  = total;
  $('#final-total2').textContent = total;
  $('#accuracy').textContent     = `정답률 ${Math.round(pct * 100)}%`;
  $('#progress-fill').style.width = '100%';

  renderReview();
  goTo('end-screen');
}

function getEndingMessage(pct) {
  if (pct === 1)       return { title: '완벽해요! 천재!', emojis: '🏆👑✨' };
  if (pct >= 0.7)      return { title: '정말 잘했어요!',  emojis: '🎉⭐🎊' };
  if (pct >= 0.4)      return { title: '잘했어요!',       emojis: '😊👍💫' };
  return                    { title: '다시 해볼까요?',   emojis: '💪🌱📚' };
}

function renderReview() {
  const reviewToggle = $('#review-toggle');
  const reviewList   = $('#review-list');
  const wrong = state.game.wrongAnswers;
  reviewList.classList.remove('open');
  reviewList.innerHTML = '';

  if (wrong.length === 0) {
    reviewToggle.style.display = 'none';
    return;
  }

  reviewToggle.style.display = 'inline-block';
  reviewToggle.textContent = `📝 틀린 문제 다시 보기 (${wrong.length}개) ▼`;

  wrong.forEach(w => {
    const item = document.createElement('div');
    item.className = 'review-item';
    const reason = w.reason === 'timeout' ? '⏱ 시간초과' : '❌ 오답';
    item.innerHTML = `
      <span class="review-emoji">${w.emoji}</span>
      <div class="review-word">${w.word}<small>${w.category} · ${reason}</small></div>
    `;
    if (TTS_AVAILABLE && state.settings.ttsEnabled) {
      const btn = document.createElement('button');
      btn.className = 'review-tts';
      btn.textContent = '🔊';
      btn.onclick = () => speak(w.word, btn);
      item.appendChild(btn);
    }
    reviewList.appendChild(item);
  });
}

export function toggleReview() {
  const list = $('#review-list');
  const btn  = $('#review-toggle');
  list.classList.toggle('open');
  const isOpen = list.classList.contains('open');
  btn.textContent = btn.textContent.replace(/[▼▲]/, isOpen ? '▲' : '▼');
}

/* =========================================================
 * 초성 입력 모드
 * ========================================================= */

/**
 * 키보드(자음 19개 + 지우기)를 한 번 렌더링 — main.js 초기화 시 호출
 */
export function renderChosungKeyboard() {
  const kb = $('#chosung-keyboard');
  if (!kb) return;
  kb.innerHTML = '';
  CHOSUNG.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'chosung-key';
    btn.textContent = c;
    btn.onclick = () => pressChosung(c);
    kb.appendChild(btn);
  });
  const erase = document.createElement('button');
  erase.className = 'chosung-key erase';
  erase.textContent = '⌫ 지우기';
  erase.onclick = eraseChosung;
  kb.appendChild(erase);
}

function renderChosungSlots(word) {
  const container = $('#chosung-slots');
  const target = getChosung(word);
  state.game.targetChosung = target;
  state.game.currentInput = [];

  container.innerHTML = '';
  for (let i = 0; i < target.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'chosung-slot';
    container.appendChild(slot);
  }
}

function updateSlots() {
  const slots = $$('#chosung-slots .chosung-slot');
  slots.forEach((slot, i) => {
    slot.classList.remove('filled', 'correct', 'wrong');
    const ch = state.game.currentInput[i];
    slot.textContent = ch || '';
    if (ch) slot.classList.add('filled');
  });
}

function pressChosung(ch) {
  if (state.game.revealed) return;
  const target = state.game.targetChosung;
  if (!target) return;
  if (state.game.currentInput.length >= target.length) return;
  state.game.currentInput.push(ch);
  updateSlots();
  if (state.game.currentInput.length === target.length) {
    checkChosungInput();
  }
}

function eraseChosung() {
  if (state.game.revealed) return;
  if (state.game.currentInput.length === 0) return;
  state.game.currentInput.pop();
  updateSlots();
}

function checkChosungInput() {
  const user = state.game.currentInput.join('');
  const target = state.game.targetChosung;
  const correct = user === target;

  const slots = $$('#chosung-slots .chosung-slot');
  slots.forEach((slot, i) => {
    slot.classList.remove('filled');
    if (state.game.currentInput[i] === target[i]) {
      slot.classList.add('correct');
    } else {
      slot.classList.add('wrong');
    }
  });

  state.game.revealed = true;
  stopTimer();

  const q = state.game.questions[state.game.currentIdx];
  const wordEl = $('#word');
  wordEl.textContent = q.word;
  wordEl.classList.add('revealed');

  if (correct) {
    state.game.score++;
    $('#score').textContent = state.game.score;
    playCorrect();
  } else {
    state.game.wrongAnswers.push({ ...q, reason: 'wrong' });
    playIncorrect();
  }

  if (state.settings.ttsEnabled) speak(q.word);
  setTimeout(advance, correct ? INPUT_CORRECT_DELAY : INPUT_WRONG_DELAY);
}
