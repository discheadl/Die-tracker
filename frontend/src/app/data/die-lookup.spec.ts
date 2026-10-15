import { findDieByNumber } from './die-lookup';
import { Die, DieStatus } from '../models/die.model';

const die = (id: number, dieNumber: string): Die => ({
  id,
  dieNumber,
  rotorNumber: null,
  statorNumber: null,
  status: DieStatus.RUN,
  location: null,
  hits: 0,
  hitsThreshold: null,
  notes: null,
});

describe('findDieByNumber', () => {
  const dies = [die(1, '49'), die(2, '490'), die(3, 'AB-12')];

  it('matches the exact die number, not a partial one', () => {
    expect(findDieByNumber(dies, '49')?.id).toBe(1);
    expect(findDieByNumber(dies, '4')).toBeNull();
  });

  it('ignores case and the whitespace a scanner may add', () => {
    expect(findDieByNumber(dies, '  ab-12\r\n')?.id).toBe(3);
  });

  it('returns null for empty or unknown input', () => {
    expect(findDieByNumber(dies, '')).toBeNull();
    expect(findDieByNumber(dies, '999')).toBeNull();
  });
});
