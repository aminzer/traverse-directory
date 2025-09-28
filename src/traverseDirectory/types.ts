import { FsEntry } from '../models';

type OnEachChildOptions = {
  skipEntryChildrenIteration: () => void;
};

export type OnEachChild = (fsEntry: FsEntry, options: OnEachChildOptions) => void | Promise<void>;
