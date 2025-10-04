import assert from 'node:assert';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import directoryExists from '../directoryExists.js';

describe('utils > fs > directoryExists', () => {
  describe('when path does not exist', () => {
    const invalidPath = join(import.meta.dirname, 'invalid/path');

    it('returns false', async () => {
      assert.strictEqual(await directoryExists(invalidPath), false);
    });
  });

  describe('when path corresponds to file', () => {
    const filePath = import.meta.filename;

    it('returns false', async () => {
      assert.strictEqual(await directoryExists(filePath), false);
    });
  });

  describe('when path corresponds to directory', () => {
    const dirPath = import.meta.dirname;

    it('returns true', async () => {
      assert.strictEqual(await directoryExists(dirPath), true);
    });
  });
});
