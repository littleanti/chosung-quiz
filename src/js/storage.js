/**
 * 설정 영속화 (localStorage)
 * 저장 실패해도 앱은 정상 동작합니다.
 */

import { STORAGE_KEY, DEFAULT_SETTINGS } from './config.js';
import { state } from './state.js';
import { CATEGORIES } from '../data/words.js';

export function saveSettings() {
  try {
    const toSave = {
      ...state.settings,
      categories: [...state.settings.categories],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) {
    /* 무시 - private 모드 등에서 저장 실패해도 앱은 작동 */
  }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    state.settings = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      categories: new Set(
        parsed.categories && parsed.categories.length ? parsed.categories : CATEGORIES
      ),
    };
  } catch (e) {
    /* 무시 - 파싱 실패 시 기본값 사용 */
  }
}
