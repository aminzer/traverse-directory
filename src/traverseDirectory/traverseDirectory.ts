import { directoryExist } from '../utils/fs';
import traverseDirectoryRecursive from './traverseDirectoryRecursive';
import { OnEachChild } from './types';

const traverseDirectory = async (dirPath: string, onEachChild: OnEachChild): Promise<void> => {
  if (!(await directoryExist(dirPath))) {
    throw new Error(`Directory "${dirPath}" does not exist`);
  }

  await traverseDirectoryRecursive(dirPath, null, onEachChild);
};

export default traverseDirectory;
