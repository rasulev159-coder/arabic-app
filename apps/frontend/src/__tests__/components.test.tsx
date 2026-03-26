import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { LevelBadge, StreakBadge } from '../components/ui/Badges';

// ── Button ────────────────────────────────────────────────────────────────────
describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const fn = vi.fn();
    render(<Button onClick={fn}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(fn).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const fn = vi.fn();
    render(<Button disabled onClick={fn}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(fn).not.toHaveBeenCalled();
  });

  it('applies danger variant class', () => {
    const { container } = render(<Button variant="danger">Danger</Button>);
    expect(container.firstChild).toHaveClass('text-[#c95050]');
  });

  it('applies success variant class', () => {
    const { container } = render(<Button variant="success">Success</Button>);
    expect(container.firstChild).toHaveClass('text-[#4caf78]');
  });
});

// ── LevelBadge ────────────────────────────────────────────────────────────────
describe('LevelBadge', () => {
  it('renders beginner level', () => {
    render(<LevelBadge level="beginner" />);
    expect(screen.getByText(/levels.beginner/i)).toBeInTheDocument();
  });

  it('renders master level', () => {
    render(<LevelBadge level="master" />);
    expect(screen.getByText(/levels.master/i)).toBeInTheDocument();
  });

  it('renders all four levels without throwing', () => {
    const levels = ['beginner', 'student', 'expert', 'master'] as const;
    for (const level of levels) {
      const { unmount } = render(<LevelBadge level={level} />);
      unmount();
    }
  });
});

// ── StreakBadge ───────────────────────────────────────────────────────────────
describe('StreakBadge', () => {
  it('renders nothing for streak=0', () => {
    const { container } = render(<StreakBadge current={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders streak count when > 0', () => {
    render(<StreakBadge current={7} />);
    expect(screen.getByText(/7/)).toBeInTheDocument();
  });

  it('shows fire emoji', () => {
    render(<StreakBadge current={3} />);
    expect(screen.getByText(/🔥/)).toBeInTheDocument();
  });
});
