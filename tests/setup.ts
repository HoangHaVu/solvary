import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import i18n from '../src/i18n';

// Tests laufen mit deutscher Sprache, damit bestehende Assertions mit deutschen
// Texten weiterhin funktionieren.
i18n.changeLanguage('de');

afterEach(() => {
  cleanup();
  // Fälle, in denen ein Test die Sprache auf EN umstellt, zurücksetzen.
  i18n.changeLanguage('de');
});
