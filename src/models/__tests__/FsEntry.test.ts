import { join, resolve } from 'node:path';
import FsEntry from '../FsEntry';

describe('models > FsEntry', () => {
  describe('constructor', () => {
    it('initializes instance with correct params', () => {
      const opts = {
        name: 'name',
        absolutePath: resolve('root', 'some', 'path'),
        relativePath: join('some', 'path'),
        isFile: true,
        size: 32,
      };

      const fsEntry = new FsEntry(opts);

      expect(fsEntry).toEqual(opts);
    });
  });

  describe('get isDirectory', () => {
    const fsEntry = new FsEntry();

    it('returns boolean opposite to "isFile"', () => {
      fsEntry.isFile = true;
      expect(fsEntry.isDirectory).toBe(false);

      fsEntry.isFile = false;
      expect(fsEntry.isDirectory).toBe(true);
    });
  });

  describe('set isDirectory', () => {
    const fsEntry = new FsEntry();

    it('sets "isFile" to opposite boolean to the passed value', () => {
      fsEntry.isDirectory = true;
      expect(fsEntry.isFile).toBe(false);

      fsEntry.isDirectory = false;
      expect(fsEntry.isFile).toBe(true);
    });
  });
});
