import { Die } from '../models/die.model';

export function findDieByNumber(dies: Die[], scanned: string): Die | null {
  const target = scanned.trim().toLowerCase();
  if (!target) return null;

  return dies.find((die) => die.dieNumber.trim().toLowerCase() === target) ?? null;
}
