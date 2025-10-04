import assert from 'node:assert';
import { describe, it } from 'node:test';
import FsEntry from '../FsEntry.js';

describe('models > FsEntry', () => {
  describe('when entry is file', () => {
    it('initializes instance with correct fields', () => {
      const fsEntry = new FsEntry({
        name: 'the_file.txt',
        absolutePath: '/absolute/path/to/the_file.txt',
        relativePath: '/path/to/the_file.txt',
        isFile: true,
        size: 32,
      });

      assert.strictEqual(fsEntry.name, 'the_file.txt');
      assert.strictEqual(fsEntry.absolutePath, '/absolute/path/to/the_file.txt');
      assert.strictEqual(fsEntry.relativePath, '/path/to/the_file.txt');
      assert.strictEqual(fsEntry.isFile, true);
      assert.strictEqual(fsEntry.isDirectory, false);
      assert.strictEqual(fsEntry.size, 32);
    });
  });

  describe('when entry is directory', () => {
    it('initializes instance with correct fields', () => {
      const fsEntry = new FsEntry({
        name: 'the_directory',
        absolutePath: '/absolute/path/to/the_directory',
        relativePath: '/path/to/the_directory',
        isFile: false,
        size: 0,
      });

      assert.strictEqual(fsEntry.name, 'the_directory');
      assert.strictEqual(fsEntry.absolutePath, '/absolute/path/to/the_directory');
      assert.strictEqual(fsEntry.relativePath, '/path/to/the_directory');
      assert.strictEqual(fsEntry.isFile, false);
      assert.strictEqual(fsEntry.isDirectory, true);
      assert.strictEqual(fsEntry.size, 0);
    });
  });
});
