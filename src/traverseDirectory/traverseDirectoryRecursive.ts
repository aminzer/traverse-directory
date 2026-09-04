import { join } from 'node:path';
import { stat, readdir } from 'node:fs/promises';
import { Dirent, Stats } from 'node:fs';
import { FsEntry } from '../models/index.js';
import { iterateInSeries } from '../utils/iteration/index.js';
import { OnEachChild } from './types.js';

const STAT_CONCURRENCY = 64;

const traverseDirectoryRecursive = async (
  absoluteDirPath: string,
  relativeDirPath: string | null,
  onEachChild: OnEachChild,
): Promise<void> => {
  const entries = await readdir(absoluteDirPath, { withFileTypes: true });

  for (let batchStart = 0; batchStart < entries.length; batchStart += STAT_CONCURRENCY) {
    const batchEntries = entries.slice(batchStart, batchStart + STAT_CONCURRENCY);

    const batchStats = await Promise.all(
      batchEntries.map((entry: Dirent): Promise<Stats> | null => {
        return entry.isDirectory() ? null : stat(join(absoluteDirPath, entry.name));
      }),
    );

    await iterateInSeries(batchEntries, async ({ name }: Dirent, index: number) => {
      const absolutePath = join(absoluteDirPath, name);
      const relativePath = relativeDirPath ? join(relativeDirPath, name) : name;

      const stats = batchStats[index];
      const isFile = stats !== null && stats.isFile();
      const size = isFile ? stats.size : 0;

      const fsEntry = new FsEntry({
        name,
        absolutePath,
        relativePath,
        isFile,
        size,
      });

      let iterateEntry = fsEntry.isDirectory;

      const skipEntryChildrenIteration = () => {
        iterateEntry = false;
      };

      await onEachChild(fsEntry, { skipEntryChildrenIteration });

      if (iterateEntry) {
        await traverseDirectoryRecursive(absolutePath, relativePath, onEachChild);
      }
    });
  }
};

export default traverseDirectoryRecursive;
