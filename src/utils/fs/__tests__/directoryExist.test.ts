import assert from 'node:assert';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import directoryExist from '../directoryExist';

describe('utils > fs > directoryExist', () => {
  describe('when path does not exist', () => {
    const invalidPath = join(import.meta.dirname, 'invalid/path');

    it('returns false', async () => {
      assert.strictEqual(await directoryExist(invalidPath), false);
    });
  });

  describe('when path corresponds to file', () => {
    const filePath = import.meta.filename;

    it('returns false', async () => {
      assert.strictEqual(await directoryExist(filePath), false);
    });
  });

  describe('when path corresponds to directory', () => {
    const dirPath = import.meta.dirname;

    it('returns true', async () => {
      assert.strictEqual(await directoryExist(dirPath), true);
    });
  });
});
