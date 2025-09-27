import { join } from 'node:path';
import { FsEntry } from '../../models';
import traverseDirectory from '../traverseDirectory';

const prepareFsEntries = (
  entries: {
    name: string;
    relativePath: string;
    isFile: boolean;
    size: number;
  }[],
  basePath: string,
) =>
  entries.map(
    (options) =>
      new FsEntry({
        ...options,
        absolutePath: join(basePath, options.relativePath),
      }),
  );

describe('traverseDirectory', () => {
  describe('when path does not exist', () => {
    const invalidDirPath = join(__dirname, 'invalid/path');

    it('is rejected with error', async () => {
      await expect(traverseDirectory(invalidDirPath, () => {})).rejects.toThrow(
        `Directory "${invalidDirPath}" does not exist`,
      );
    });
  });

  describe('when path corresponds to file', () => {
    const filePath = __filename;

    it('is rejected with error', async () => {
      await expect(traverseDirectory(filePath, () => {})).rejects.toThrow(
        `Directory "${filePath}" does not exist`,
      );
    });
  });

  describe('when path corresponds to directory', () => {
    const dirPath = join(__dirname, '../../../test/resources/test_directory');

    describe('when callback is executed without rejections for each element', () => {
      let fsEntries;
      let returnValue;

      beforeEach(async () => {
        fsEntries = [];

        returnValue = traverseDirectory(dirPath, (fsEntry) => {
          fsEntries.push(fsEntry);
        });
      });

      it('is resolved to "undefined"', async () => {
        await expect(returnValue).resolves.toBe(undefined);
      });

      it('triggers callback for each file and directory in source directory tree', async () => {
        await returnValue;

        const expectedFsEntries = prepareFsEntries(
          [
            {
              name: '.dot_file',
              relativePath: '.dot_file',
              isFile: true,
              size: 9,
            },
            {
              name: 'dir_1',
              relativePath: 'dir_1',
              isFile: false,
              size: 0,
            },
            {
              name: 'file_1_1.txt',
              relativePath: join('dir_1', 'file_1_1.txt'),
              isFile: true,
              size: 12,
            },
            {
              name: 'file_1_2.txt',
              relativePath: join('dir_1', 'file_1_2.txt'),
              isFile: true,
              size: 12,
            },
            {
              name: 'dir_2',
              relativePath: 'dir_2',
              isFile: false,
              size: 0,
            },
            {
              name: 'dir_2_1',
              relativePath: join('dir_2', 'dir_2_1'),
              isFile: false,
              size: 0,
            },
            {
              name: 'file_2_1_1.txt',
              relativePath: join('dir_2', 'dir_2_1', 'file_2_1_1.txt'),
              isFile: true,
              size: 14,
            },
            {
              name: 'file_2_1_2.txt',
              relativePath: join('dir_2', 'dir_2_1', 'file_2_1_2.txt'),
              isFile: true,
              size: 14,
            },
            {
              name: 'dir_2_2',
              relativePath: join('dir_2', 'dir_2_2'),
              isFile: false,
              size: 0,
            },
            {
              name: 'file_2_2_1.txt',
              relativePath: join('dir_2', 'dir_2_2', 'file_2_2_1.txt'),
              isFile: true,
              size: 14,
            },
            {
              name: 'file_2_2_2.txt',
              relativePath: join('dir_2', 'dir_2_2', 'file_2_2_2.txt'),
              isFile: true,
              size: 14,
            },
            {
              name: 'file_2_1.txt',
              relativePath: join('dir_2', 'file_2_1.txt'),
              isFile: true,
              size: 12,
            },
            {
              name: 'file_2_2.txt',
              relativePath: join('dir_2', 'file_2_2.txt'),
              isFile: true,
              size: 12,
            },
            {
              name: 'file_1.txt',
              relativePath: 'file_1.txt',
              isFile: true,
              size: 10,
            },
            {
              name: 'file_2.txt',
              relativePath: 'file_2.txt',
              isFile: true,
              size: 10,
            },
          ],
          dirPath,
        );

        expect(fsEntries.every((fsEntry) => fsEntry instanceof FsEntry)).toBe(true);
        expect(fsEntries).toEqual(expectedFsEntries);
      });
    });

    describe('when async callback is passed', () => {
      let returnValue;
      const logs: string[] = [];

      beforeEach(async () => {
        returnValue = traverseDirectory(dirPath, async (fsEntry) => {
          logs.push(`Processing ${fsEntry.name}`);

          await new Promise((resolve) => setTimeout(resolve, 1));

          logs.push(`Processed ${fsEntry.name}`);
        });
      });

      it('waits current entry Promise resolving before calling callback on next entry', async () => {
        await returnValue;

        expect(logs).toEqual([
          'Processing .dot_file',
          'Processed .dot_file',
          'Processing dir_1',
          'Processed dir_1',
          'Processing file_1_1.txt',
          'Processed file_1_1.txt',
          'Processing file_1_2.txt',
          'Processed file_1_2.txt',
          'Processing dir_2',
          'Processed dir_2',
          'Processing dir_2_1',
          'Processed dir_2_1',
          'Processing file_2_1_1.txt',
          'Processed file_2_1_1.txt',
          'Processing file_2_1_2.txt',
          'Processed file_2_1_2.txt',
          'Processing dir_2_2',
          'Processed dir_2_2',
          'Processing file_2_2_1.txt',
          'Processed file_2_2_1.txt',
          'Processing file_2_2_2.txt',
          'Processed file_2_2_2.txt',
          'Processing file_2_1.txt',
          'Processed file_2_1.txt',
          'Processing file_2_2.txt',
          'Processed file_2_2.txt',
          'Processing file_1.txt',
          'Processed file_1.txt',
          'Processing file_2.txt',
          'Processed file_2.txt',
        ]);
      });
    });

    describe('when callback is rejected for some file or directory in source directory tree', () => {
      let fsEntries;
      let returnValue;

      beforeEach(async () => {
        fsEntries = [];

        returnValue = traverseDirectory(dirPath, (fsEntry) => {
          if (fsEntry.name === 'file_1_2.txt') {
            throw new Error('Test error');
          }

          fsEntries.push(fsEntry);
        });
      });

      it('is rejected with corresponding error', async () => {
        await expect(returnValue).rejects.toThrow('Test error');
      });

      it("doesn't trigger callback after rejected file or directory", async () => {
        try {
          await returnValue;
        } catch {
          // ignored
        }

        const expectedFsEntries = prepareFsEntries(
          [
            {
              name: '.dot_file',
              relativePath: '.dot_file',
              isFile: true,
              size: 9,
            },
            {
              name: 'dir_1',
              relativePath: 'dir_1',
              isFile: false,
              size: 0,
            },
            {
              name: 'file_1_1.txt',
              relativePath: join('dir_1', 'file_1_1.txt'),
              isFile: true,
              size: 12,
            },
          ],
          dirPath,
        );

        expect(fsEntries).toEqual(expectedFsEntries);
      });
    });

    describe('when "skipEntryChildrenIteration" is called for some directory', () => {
      it("doesn't trigger callback for children of that directory", async () => {
        const fsEntries = [];

        await traverseDirectory(dirPath, (fsEntry, { skipEntryChildrenIteration }) => {
          fsEntries.push(fsEntry);

          if (fsEntry.name === 'dir_2') {
            skipEntryChildrenIteration();
          }
        });

        const expectedFsEntries = prepareFsEntries(
          [
            {
              name: '.dot_file',
              relativePath: '.dot_file',
              isFile: true,
              size: 9,
            },
            {
              name: 'dir_1',
              relativePath: 'dir_1',
              isFile: false,
              size: 0,
            },
            {
              name: 'file_1_1.txt',
              relativePath: join('dir_1', 'file_1_1.txt'),
              isFile: true,
              size: 12,
            },
            {
              name: 'file_1_2.txt',
              relativePath: join('dir_1', 'file_1_2.txt'),
              isFile: true,
              size: 12,
            },
            {
              name: 'dir_2',
              relativePath: 'dir_2',
              isFile: false,
              size: 0,
            },
            {
              name: 'file_1.txt',
              relativePath: 'file_1.txt',
              isFile: true,
              size: 10,
            },
            {
              name: 'file_2.txt',
              relativePath: 'file_2.txt',
              isFile: true,
              size: 10,
            },
          ],
          dirPath,
        );

        expect(fsEntries).toEqual(expectedFsEntries);
      });
    });
  });
});
