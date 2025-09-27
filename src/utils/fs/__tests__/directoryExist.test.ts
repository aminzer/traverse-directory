import { join } from 'node:path';
import directoryExist from '../directoryExist';

describe('utils > fs > directoryExist', () => {
  describe('when path does not exist', () => {
    const invalidPath = join(__dirname, 'invalid/path');

    it('returns false', async () => {
      expect(await directoryExist(invalidPath)).toBe(false);
    });
  });

  describe('when path corresponds to file', () => {
    const filePath = __filename;

    it('returns false', async () => {
      expect(await directoryExist(filePath)).toBe(false);
    });
  });

  describe('when path corresponds to directory', () => {
    const dirPath = __dirname;

    it('returns true', async () => {
      expect(await directoryExist(dirPath)).toBe(true);
    });
  });
});
