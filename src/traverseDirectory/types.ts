import { FsEntry } from '../models/index.js';

type OnEachChildOptions = {
  skipEntryChildrenIteration: () => void;
};

export type OnEachChild = (fsEntry: FsEntry, options: OnEachChildOptions) => void | Promise<void>;
