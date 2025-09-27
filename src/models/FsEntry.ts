class FsEntry {
  name: string;

  absolutePath: string;

  relativePath: string;

  isFile: boolean;

  size: number;

  constructor({
    name = null,
    absolutePath = null,
    relativePath = null,
    isFile = null,
    size = null,
  }: {
    name?: string;
    absolutePath?: string;
    relativePath?: string;
    isFile?: boolean;
    size?: number;
  } = {}) {
    this.name = name;
    this.absolutePath = absolutePath;
    this.relativePath = relativePath;
    this.isFile = isFile;
    this.size = size;
  }

  get isDirectory(): boolean {
    return !this.isFile;
  }

  set isDirectory(isDirectory: boolean) {
    this.isFile = !isDirectory;
  }
}

export default FsEntry;
