"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = require("../index");
(0, vitest_1.describe)('LETTERS data', () => {
    (0, vitest_1.it)('has exactly 28 letters', () => {
        (0, vitest_1.expect)(index_1.LETTERS).toHaveLength(28);
    });
    (0, vitest_1.it)('each letter has a unique code', () => {
        const codes = index_1.LETTERS.map(l => l.code);
        (0, vitest_1.expect)(new Set(codes).size).toBe(28);
    });
    (0, vitest_1.it)('each letter has a unique index 1-28', () => {
        const indices = index_1.LETTERS.map(l => l.index).sort((a, b) => a - b);
        (0, vitest_1.expect)(indices).toEqual(Array.from({ length: 28 }, (_, i) => i + 1));
    });
    (0, vitest_1.it)('each letter has all four forms', () => {
        for (const letter of index_1.LETTERS) {
            (0, vitest_1.expect)(letter.iso, `${letter.code} missing iso`).toBeTruthy();
            (0, vitest_1.expect)(letter.ini, `${letter.code} missing ini`).toBeTruthy();
            (0, vitest_1.expect)(letter.med, `${letter.code} missing med`).toBeTruthy();
            (0, vitest_1.expect)(letter.fin, `${letter.code} missing fin`).toBeTruthy();
        }
    });
    (0, vitest_1.it)('each letter has names in all three languages', () => {
        for (const letter of index_1.LETTERS) {
            (0, vitest_1.expect)(letter.nameRu, `${letter.code} missing nameRu`).toBeTruthy();
            (0, vitest_1.expect)(letter.nameUz, `${letter.code} missing nameUz`).toBeTruthy();
            (0, vitest_1.expect)(letter.nameEn, `${letter.code} missing nameEn`).toBeTruthy();
        }
    });
    (0, vitest_1.it)('all grouped letters have valid group ids', () => {
        const validGroups = ['btt', 'jch', 'dz', 'rz', 'ss', 'sd', 'tz', 'ag', 'fq'];
        for (const letter of index_1.LETTERS) {
            if (letter.group) {
                (0, vitest_1.expect)(validGroups).toContain(letter.group);
            }
        }
    });
});
(0, vitest_1.describe)('getLevel', () => {
    (0, vitest_1.it)('returns beginner for 0 letters', () => {
        (0, vitest_1.expect)((0, index_1.getLevel)(0)).toBe('beginner');
    });
    (0, vitest_1.it)('returns beginner for 6 letters', () => {
        (0, vitest_1.expect)((0, index_1.getLevel)(6)).toBe('beginner');
    });
    (0, vitest_1.it)('returns student for 7 letters', () => {
        (0, vitest_1.expect)((0, index_1.getLevel)(7)).toBe('student');
    });
    (0, vitest_1.it)('returns student for 13 letters', () => {
        (0, vitest_1.expect)((0, index_1.getLevel)(13)).toBe('student');
    });
    (0, vitest_1.it)('returns expert for 14 letters', () => {
        (0, vitest_1.expect)((0, index_1.getLevel)(14)).toBe('expert');
    });
    (0, vitest_1.it)('returns expert for 21 letters', () => {
        (0, vitest_1.expect)((0, index_1.getLevel)(21)).toBe('expert');
    });
    (0, vitest_1.it)('returns master for 22 letters', () => {
        (0, vitest_1.expect)((0, index_1.getLevel)(22)).toBe('master');
    });
    (0, vitest_1.it)('returns master for 28 letters', () => {
        (0, vitest_1.expect)((0, index_1.getLevel)(28)).toBe('master');
    });
});
(0, vitest_1.describe)('getLetterName', () => {
    const alif = index_1.LETTERS[0]; // ا Алиф
    (0, vitest_1.it)('returns Russian name for ru', () => {
        (0, vitest_1.expect)((0, index_1.getLetterName)(alif, 'ru')).toBe('Алиф');
    });
    (0, vitest_1.it)('returns Uzbek name for uz', () => {
        (0, vitest_1.expect)((0, index_1.getLetterName)(alif, 'uz')).toBe('Alif');
    });
    (0, vitest_1.it)('returns English name for en', () => {
        (0, vitest_1.expect)((0, index_1.getLetterName)(alif, 'en')).toBe('Alif');
    });
});
(0, vitest_1.describe)('LEVEL_LABELS', () => {
    (0, vitest_1.it)('has entries for all three languages', () => {
        (0, vitest_1.expect)(index_1.LEVEL_LABELS.ru).toBeDefined();
        (0, vitest_1.expect)(index_1.LEVEL_LABELS.uz).toBeDefined();
        (0, vitest_1.expect)(index_1.LEVEL_LABELS.en).toBeDefined();
    });
    (0, vitest_1.it)('has all four level keys in each language', () => {
        const keys = ['beginner', 'student', 'expert', 'master'];
        for (const lang of ['ru', 'uz', 'en']) {
            for (const key of keys) {
                (0, vitest_1.expect)(index_1.LEVEL_LABELS[lang][key]).toBeTruthy();
            }
        }
    });
});
(0, vitest_1.describe)('ACHIEVEMENTS_SEED', () => {
    (0, vitest_1.it)('has 13 achievements', () => {
        (0, vitest_1.expect)(index_1.ACHIEVEMENTS_SEED).toHaveLength(13);
    });
    (0, vitest_1.it)('each achievement has a unique key', () => {
        const keys = index_1.ACHIEVEMENTS_SEED.map(a => a.key);
        (0, vitest_1.expect)(new Set(keys).size).toBe(index_1.ACHIEVEMENTS_SEED.length);
    });
    (0, vitest_1.it)('each achievement has translations in all three languages', () => {
        for (const ach of index_1.ACHIEVEMENTS_SEED) {
            (0, vitest_1.expect)(ach.nameRu, `${ach.key} missing nameRu`).toBeTruthy();
            (0, vitest_1.expect)(ach.nameUz, `${ach.key} missing nameUz`).toBeTruthy();
            (0, vitest_1.expect)(ach.nameEn, `${ach.key} missing nameEn`).toBeTruthy();
            (0, vitest_1.expect)(ach.descRu, `${ach.key} missing descRu`).toBeTruthy();
            (0, vitest_1.expect)(ach.descUz, `${ach.key} missing descUz`).toBeTruthy();
            (0, vitest_1.expect)(ach.descEn, `${ach.key} missing descEn`).toBeTruthy();
        }
    });
    (0, vitest_1.it)('each achievement has an icon', () => {
        for (const ach of index_1.ACHIEVEMENTS_SEED) {
            (0, vitest_1.expect)(ach.icon).toBeTruthy();
        }
    });
    (0, vitest_1.it)('each achievement has a valid condition type', () => {
        const validTypes = [
            'letters_known', 'streak', 'perfect_session',
            'session_speed', 'total_correct_mode', 'time_of_day', 'challenge_win',
        ];
        for (const ach of index_1.ACHIEVEMENTS_SEED) {
            (0, vitest_1.expect)(validTypes).toContain(ach.condition.type);
        }
    });
});
//# sourceMappingURL=index.test.js.map