import { join } from 'node:path';
import { stat, readdir } from 'node:fs/promises';
import { FsEntry } from '../models';
import { iterateInSeries } from '../utils/iteration';
import { OnEachChild } from './types';

const traverseDirectoryRecursive = async (
  absoluteDirPath: string,
  relativeDirPath: string,
  onEachChild: OnEachChild,
): Promise<void> => {
  const entries = await readdir(absoluteDirPath);

  await iterateInSeries(entries, async (name: string) => {
    const absolutePath = join(absoluteDirPath, name);
    const relativePath = relativeDirPath ? join(relativeDirPath, name) : name;

    const stats = await stat(absolutePath);
    const isFile = stats.isFile();
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
};

export default traverseDirectoryRecursive;
