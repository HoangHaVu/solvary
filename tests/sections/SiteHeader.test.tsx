import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SiteHeader from '../../src/sections/SiteHeader';
import i18n from '../../src/i18n';

describe('SiteHeader', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('de');
  });

  it('rendert Navigation und CTA', () => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    expect(screen.getByText('Produkte')).toBeInTheDocument();
    expect(screen.getByText('Preise')).toBeInTheDocument();
    expect(screen.getByText('Kostenlos testen')).toBeInTheDocument();
  });

  it('schaltet per Globe-Icon zwischen Deutsch und Englisch um', async () => {
    render(
      <MemoryRouter>
        <SiteHeader />
      </MemoryRouter>,
    );

    expect(screen.getByText('Produkte')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('language-switcher-desktop').querySelector('button')!);
    fireEvent.click(screen.getByText('English'));

    await waitFor(() => {
      expect(screen.getByText('Products')).toBeInTheDocument();
      expect(screen.getByText('Pricing')).toBeInTheDocument();
      expect(screen.getByText('Try for free')).toBeInTheDocument();
    });
  });
});
