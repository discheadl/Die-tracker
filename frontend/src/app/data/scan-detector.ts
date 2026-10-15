const MAX_GAP_MS = 50;
const MIN_LENGTH = 2;

export class ScanDetector {
  private buffer = '';
  private lastKeyTime = 0;

  push(key: string, time: number): string | null {
    if (key === 'Enter') {
      const fast = time - this.lastKeyTime <= MAX_GAP_MS;
      const value = this.buffer;
      this.buffer = '';
      return fast && value.length >= MIN_LENGTH ? value : null;
    }

    if (key.length !== 1) return null;

    if (time - this.lastKeyTime > MAX_GAP_MS) this.buffer = '';
    this.buffer += key;
    this.lastKeyTime = time;
    return null;
  }

  reset(): void {
    this.buffer = '';
  }
}
