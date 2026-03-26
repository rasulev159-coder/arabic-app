import { describe, it, expect } from 'vitest';
import {
  LETTERS, ACHIEVEMENTS_SEED, getLevel, getLetterName,
  LEVEL_LABELS,
} from '../index';

describe('LETTERS data', () => {
  it('has exactly 28 letters', () => {
    expect(LETTERS).toHaveLength(28);
  });

  it('each letter has a unique code', () => {
    const codes = LETTERS.map(l => l.code);
    expect(new Set(codes).size).toBe(28);
  });

  it('each letter has a unique index 1-28', () => {
    const indices = LETTERS.map(l => l.index).sort((a, b) => a - b);
    expect(indices).toEqual(Array.from({ length: 28 }, (_, i) => i + 1));
  });

  it('each letter has all four forms', () => {
    for (const letter of LETTERS) {
      expect(letter.iso, `${letter.code} missing iso`).toBeTruthy();
      expect(letter.ini, `${letter.code} missing ini`).toBeTruthy();
      expect(letter.med, `${letter.code} missing med`).toBeTruthy();
      expect(letter.fin, `${letter.code} missing fin`).toBeTruthy();
    }
  });

  it('each letter has names in all three languages', () => {
    for (const letter of LETTERS) {
      expect(letter.nameRu, `${letter.code} missing nameRu`).toBeTruthy();
      expect(letter.nameUz, `${letter.code} missing nameUz`).toBeTruthy();
      expect(letter.nameEn, `${letter.code} missing nameEn`).toBeTruthy();
    }
  });

  it('all grouped letters have valid group ids', () => {
    const validGroups = ['btt','jch','dz','rz','ss','sd','tz','ag','fq'];
    for (const letter of LETTERS) {
      if (letter.group) {
        expect(validGroups).toContain(letter.group);
      }
    }
  });
});

describe('getLevel', () => {
  it('returns beginner for 0 letters', () => {
    expect(getLevel(0)).toBe('beginner');
  });

  it('returns beginner for 6 letters', () => {
    expect(getLevel(6)).toBe('beginner');
  });

  it('returns student for 7 letters', () => {
    expect(getLevel(7)).toBe('student');
  });

  it('returns student for 13 letters', () => {
    expect(getLevel(13)).toBe('student');
  });

  it('returns expert for 14 letters', () => {
    expect(getLevel(14)).toBe('expert');
  });

  it('returns expert for 21 letters', () => {
    expect(getLevel(21)).toBe('expert');
  });

  it('returns master for 22 letters', () => {
    expect(getLevel(22)).toBe('master');
  });

  it('returns master for 28 letters', () => {
    expect(getLevel(28)).toBe('master');
  });
});

describe('getLetterName', () => {
  const alif = LETTERS[0]; // ا Алиф

  it('returns Russian name for ru', () => {
    expect(getLetterName(alif, 'ru')).toBe('Алиф');
  });

  it('returns Uzbek name for uz', () => {
    expect(getLetterName(alif, 'uz')).toBe('Alif');
  });

  it('returns English name for en', () => {
    expect(getLetterName(alif, 'en')).toBe('Alif');
  });
});

describe('LEVEL_LABELS', () => {
  it('has entries for all three languages', () => {
    expect(LEVEL_LABELS.ru).toBeDefined();
    expect(LEVEL_LABELS.uz).toBeDefined();
    expect(LEVEL_LABELS.en).toBeDefined();
  });

  it('has all four level keys in each language', () => {
    const keys = ['beginner', 'student', 'expert', 'master'] as const;
    for (const lang of ['ru', 'uz', 'en'] as const) {
      for (const key of keys) {
        expect(LEVEL_LABELS[lang][key]).toBeTruthy();
      }
    }
  });
});

describe('ACHIEVEMENTS_SEED', () => {
  it('has 13 achievements', () => {
    expect(ACHIEVEMENTS_SEED).toHaveLength(13);
  });

  it('each achievement has a unique key', () => {
    const keys = ACHIEVEMENTS_SEED.map(a => a.key);
    expect(new Set(keys).size).toBe(ACHIEVEMENTS_SEED.length);
  });

  it('each achievement has translations in all three languages', () => {
    for (const ach of ACHIEVEMENTS_SEED) {
      expect(ach.nameRu, `${ach.key} missing nameRu`).toBeTruthy();
      expect(ach.nameUz, `${ach.key} missing nameUz`).toBeTruthy();
      expect(ach.nameEn, `${ach.key} missing nameEn`).toBeTruthy();
      expect(ach.descRu, `${ach.key} missing descRu`).toBeTruthy();
      expect(ach.descUz, `${ach.key} missing descUz`).toBeTruthy();
      expect(ach.descEn, `${ach.key} missing descEn`).toBeTruthy();
    }
  });

  it('each achievement has an icon', () => {
    for (const ach of ACHIEVEMENTS_SEED) {
      expect(ach.icon).toBeTruthy();
    }
  });

  it('each achievement has a valid condition type', () => {
    const validTypes = [
      'letters_known', 'streak', 'perfect_session',
      'session_speed', 'total_correct_mode', 'time_of_day', 'challenge_win',
    ];
    for (const ach of ACHIEVEMENTS_SEED) {
      expect(validTypes).toContain((ach.condition as any).type);
    }
  });
});
