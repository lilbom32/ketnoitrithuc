import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn (className merge)', () => {
  it('merges classes correctly', () => {
    expect(cn('btn', 'btn-primary')).toBe('btn btn-primary');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    expect(cn('btn', isActive && 'active')).toBe('btn active');
  });

  it('filters out falsy values', () => {
    expect(cn('btn', false && 'hidden', null, undefined, 'visible')).toBe('btn visible');
  });

  it('merges tailwind classes correctly', () => {
    expect(cn('px-2 py-2', 'px-4')).toContain('px-4');
  });
});
