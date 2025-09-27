import { stat } from 'node:fs/promises';

const directoryExist = async (path: string): Promise<boolean> => {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (err) {
    return false;
  }
};

export default directoryExist;
