import { directoryExists } from '../utils/fs/index.js';
import traverseDirectoryRecursive from './traverseDirectoryRecursive.js';
import { OnEachChild } from './types.js';

const traverseDirectory = async (dirPath: string, onEachChild: OnEachChild): Promise<void> => {
  if (!(await directoryExists(dirPath))) {
    throw new Error(`Directory "${dirPath}" does not exist`);
  }

  await traverseDirectoryRecursive(dirPath, null, onEachChild);
};

export default traverseDirectory;
