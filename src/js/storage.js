/**
 * 설정 영속화 — 현재 프로필의 settings로 라우팅
 * 실제 저장소 I/O는 profiles.js가 담당
 */

import { DEFAULT_SETTINGS } from './config.js';
import { state } from './state.js';
import { CATEGORIES } from '../data/words.js';
import { saveCurrentProfileSettings, getCurrentProfileSettings } from './profiles.js';

export function saveSettings() {
  try {
    const toSave = {
      ...state.settings,
      categories: [...state.settings.categories],
    };
    saveCurrentProfileSettings(toSave);
  } catch (e) {
    /* 무시 */
  }
}

export function loadSettings() {
  try {
    const parsed = getCurrentProfileSettings();
    if (!parsed) return;
    state.settings = {
      ...DEFAULT_SETTINGS,
      ...parsed,
      categories: new Set(
        parsed.categories && parsed.categories.length ? parsed.categories : CATEGORIES
      ),
    };
  } catch (e) {
    /* 무시 */
  }
}
