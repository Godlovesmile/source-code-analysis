import { Queue } from './queue';
import { Scheduler } from './scheduler';
import { Subscriber } from './subscriber';
import { isJsonObject } from './utils';

type PromiseResult<R> = R extends () => infer P
  ? P extends Promise<infer Result>
    ? Result
    : P
  : R extends Promise<infer S>
  ? S
  : R;

export type QueueResult<R> = R extends [infer F, ...infer N]
  ? [PromiseResult<F>, ...QueueResult<N>]
  : R extends []
  ? R
  : R extends Array<infer S>
  ? PromiseResult<S>[]
  : R[];

interface EnhanceQueue<R> extends Promise<QueueResult<R>> {
  subscribe: (listener: any) => () => void;
}
export interface Options {
  max?: number;
  interval?: number;
}

function createQueue<T extends unknown[]>(
  tasks: T,
  options: Options = {}
): EnhanceQueue<T> {
  const { max = 1, interval = 0 } = isJsonObject(options) ? options : {};
  const taskQueue = new Queue();

  tasks.forEach(task => {
    taskQueue.enqueue(task);
  })

  const subscriber = new Subscriber();
  const scheduler = new Scheduler<QueueResult<T>>(taskQueue, { max, interval }, subscriber);
  const queue = {
    subscribe: subscriber.subscribe.bind(subscriber)
  }

  return null;
}