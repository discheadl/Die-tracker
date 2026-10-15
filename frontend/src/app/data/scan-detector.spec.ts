import { ScanDetector } from './scan-detector';

function type(detector: ScanDetector, text: string, start: number, gap: number): number {
  let time = start;
  for (const char of text) {
    detector.push(char, time);
    time += gap;
  }
  return time;
}

describe('ScanDetector', () => {
  it('returns the number when characters arrive fast and end with Enter', () => {
    const detector = new ScanDetector();
    const end = type(detector, 'AB-49', 1000, 8);

    expect(detector.push('Enter', end)).toBe('AB-49');
  });

  it('ignores slow human typing', () => {
    const detector = new ScanDetector();
    const end = type(detector, '49', 1000, 220);

    expect(detector.push('Enter', end)).toBeNull();
  });

  it('ignores Enter pressed long after the last character', () => {
    const detector = new ScanDetector();
    type(detector, '49', 1000, 8);

    expect(detector.push('Enter', 4000)).toBeNull();
  });

  it('ignores a single character followed by Enter', () => {
    const detector = new ScanDetector();
    detector.push('4', 1000);

    expect(detector.push('Enter', 1010)).toBeNull();
  });

  it('skips modifier keys the scanner may send for capitals', () => {
    const detector = new ScanDetector();
    detector.push('Shift', 1000);
    detector.push('A', 1005);
    detector.push('Shift', 1010);
    detector.push('B', 1015);

    expect(detector.push('Enter', 1020)).toBe('AB');
  });

  it('starts a fresh buffer for each scan', () => {
    const detector = new ScanDetector();
    let end = type(detector, '49', 1000, 8);
    expect(detector.push('Enter', end)).toBe('49');

    end = type(detector, '50', 5000, 8);
    expect(detector.push('Enter', end)).toBe('50');
  });
});
