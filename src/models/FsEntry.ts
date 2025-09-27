class FsEntry {
  _name: string;

  _absolutePath: string;

  _relativePath: string;

  _isFile: boolean;

  _size: number;

  constructor({
    name,
    absolutePath,
    relativePath,
    isFile,
    size,
  }: {
    name: string;
    absolutePath: string;
    relativePath: string;
    isFile: boolean;
    size: number;
  }) {
    this._name = name;
    this._absolutePath = absolutePath;
    this._relativePath = relativePath;
    this._isFile = isFile;
    this._size = size;
  }

  get name(): string {
    return this._name;
  }

  get absolutePath(): string {
    return this._absolutePath;
  }

  get relativePath(): string {
    return this._relativePath;
  }

  get isFile(): boolean {
    return this._isFile;
  }

  get isDirectory(): boolean {
    return !this.isFile;
  }

  get size(): number {
    return this._size;
  }
}

export default FsEntry;
