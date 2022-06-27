import { Queue } from './queue';
import { Options, QueueResult } from './index';
import { Subscriber } from './subscriber';

export enum State {
  'INIT',
}

export class Scheduler<R = unknown> {
  private taskQueue: Queue
  private options: Options
  private subscriber: Subscriber

  constructor(taskQueue: Queue, options: Options, subscriber: Subscriber) {
    this.taskQueue = taskQueue;
    this.options = options;
    this.subscriber = subscriber;
  }
}