### Overview

[NodeJS](https://nodejs.org) utility for recursively iterating over directory contents.

It allows to traverse through all subdirectories and files within a specified directory.

### Installation

```bash
npm i @aminzer/traverse-directory
```

### Usage examples

```typescript
import { traverseDirectory } from '@aminzer/traverse-directory';

await traverseDirectory('/path/to/directory', ({ isFile, relativePath }) => {
  console.log(`${isFile ? 'File' : 'Directory'} ${relativePath} was found`);
});
```

### API

**traverseDirectory**

##### Overview

`traverseDirectory` recursively iterates over the contents of a directory.

```typescript
traverseDirectory(dirPath, onEachChild);
```

##### Parameters

* `dirPath` (`string`, required) - path to the directory whose contents should be iterated.
* `onEachChild` (`function`, required) - callback invoked for each child file and directory.

`onEachChild` callback accepts following arguments:
* `fsEntry` (`FsEntry`) - currently iterated child file or directory.
* `additionalArgs` (`object`, optional) - additional callback arguments:
    * `skipEntryChildrenIteration` (`function`) - call this function within `onEachChild` to skip iterating the children of the current entry.

##### Return value

`Promise` that resolves when the directory traversal is complete.

**FsEntry**

##### Overview

`FsEntry` - class representing File System Entry (file or directory).

```typescript
import { FsEntry } from '@aminzer/traverse-directory';
```

Instance properties:
* `name` (`string`) - name of entry.
* `absolutePath` (`string`) - absolute path to entry.
* `relativePath` (`string`) - relative path to entry. It's relative to the directory passed to `traverseDirectory`.
* `size` (`number`) - size of file in bytes, `0` for directories.
* `isFile` (`boolean`) - `true` if entry is file.
* `isDirectory` (`boolean`) - `true` if entry is directory.
