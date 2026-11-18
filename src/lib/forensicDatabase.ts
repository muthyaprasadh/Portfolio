export type FingerprintRecord = {
  id: string;
  name: string;
  capturedAt: string;
  seed: string;
};

const STORAGE_KEY = 'dexter-forensic-fingerprints-v1';

export const loadFingerprintRecords = (): FingerprintRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed)) {
    throw new Error('The local forensic archive has an invalid format.');
  }

  return parsed.filter((record): record is FingerprintRecord => (
    typeof record === 'object'
    && record !== null
    && 'id' in record
    && typeof record.id === 'string'
    && 'name' in record
    && typeof record.name === 'string'
    && 'capturedAt' in record
    && typeof record.capturedAt === 'string'
    && 'seed' in record
    && typeof record.seed === 'string'
  ));
};

export const saveFingerprintRecord = (record: FingerprintRecord): FingerprintRecord[] => {
  const records = loadFingerprintRecords();
  const updated = [record, ...records.filter((item) => item.id !== record.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const createFingerprintId = (): string => {
  const unique = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID().replace(/-/g, '').slice(0, 10)
    : Math.random().toString(36).slice(2, 12);

  return `FP-${Date.now().toString(36).toUpperCase()}-${unique.toUpperCase()}`;
};
