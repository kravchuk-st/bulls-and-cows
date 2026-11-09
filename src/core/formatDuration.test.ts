import { describe, expect, it } from 'vitest';
import { formatDuration } from './formatDuration.js';

describe('formatDuration', () => {
  it('formats zero as 00:00', () => {
    expect(formatDuration(0)).toBe('00:00');
  });

  it('drops milliseconds', () => {
    expect(formatDuration(999)).toBe('00:00');
    expect(formatDuration(1000)).toBe('00:01');
  });

  it('formats minutes and seconds with leading zeros', () => {
    expect(formatDuration(61_000)).toBe('01:01');
    expect(formatDuration(599_000)).toBe('09:59');
  });

  it('keeps counting minutes past one hour', () => {
    expect(formatDuration(3_600_000)).toBe('60:00');
  });

  it('treats negative values as zero', () => {
    expect(formatDuration(-500)).toBe('00:00');
  });
});
