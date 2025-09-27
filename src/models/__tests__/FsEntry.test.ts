import FsEntry from '../FsEntry';

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

      expect(fsEntry.name).toBe('the_file.txt');
      expect(fsEntry.absolutePath).toBe('/absolute/path/to/the_file.txt');
      expect(fsEntry.relativePath).toBe('/path/to/the_file.txt');
      expect(fsEntry.isFile).toBe(true);
      expect(fsEntry.isDirectory).toBe(false);
      expect(fsEntry.size).toBe(32);
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

      expect(fsEntry.name).toBe('the_directory');
      expect(fsEntry.absolutePath).toBe('/absolute/path/to/the_directory');
      expect(fsEntry.relativePath).toBe('/path/to/the_directory');
      expect(fsEntry.isFile).toBe(false);
      expect(fsEntry.isDirectory).toBe(true);
      expect(fsEntry.size).toBe(0);
    });
  });
});
