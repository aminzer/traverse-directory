import assert from 'node:assert';
import { beforeEach, describe, it } from 'node:test';
import iterateInSeries from '../iterateInSeries';

describe('utils > iteration > iterateInSeries', () => {
  let sourceArray: string[] = [];
  let logs: string[] = [];

  beforeEach(() => {
    sourceArray = ['a', 'b', 'c'];
    logs = [];
  });

  describe('when sync callback is passed', () => {
    beforeEach(async () => {
      await iterateInSeries(sourceArray, (element, index) => {
        logs.push(`processed ${element}:${index}`);
      });
    });

    it('calls callback function for each array element in series', () => {
      assert.deepStrictEqual(logs, ['processed a:0', 'processed b:1', 'processed c:2']);
    });
  });

  describe('when async callback is passed', () => {
    beforeEach(async () => {
      await iterateInSeries(sourceArray, async (element) => {
        logs.push(`processing ${element}`);

        await new Promise((resolve) => setTimeout(resolve, 1));

        logs.push(`processed ${element}`);
      });
    });

    it('waits current element Promise resolving before calling callback on next element', () => {
      assert.deepStrictEqual(logs, [
        'processing a',
        'processed a',
        'processing b',
        'processed b',
        'processing c',
        'processed c',
        'TEMP CHANGE TO TEST PIPELINE',
      ]);
    });
  });

  describe('when callback rejects with error for some element', () => {
    let returnValue: Promise<void>;

    beforeEach(async () => {
      returnValue = iterateInSeries(['a', 'b', 'c'], async (element) => {
        logs.push(`processing ${element}`);

        if (element === 'b') {
          throw new Error(`Test error on element ${element}`);
        }

        logs.push(`processed ${element}`);
      });
    });

    it('is rejected with corresponding error', async () => {
      await assert.rejects(() => returnValue, { message: 'Test error on element b' });
    });

    it("doesn't trigger callback after rejected element", async () => {
      try {
        await returnValue;
      } catch {
        // ignored
      }

      assert.deepStrictEqual(logs, ['processing a', 'processed a', 'processing b']);
    });
  });
});
