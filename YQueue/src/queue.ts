import { State } from "./scheduler"

export class Queue {
  tasks: Record<number, unknown> = {}
  count: 0
  private state: State.INIT

  enqueue(task: unknown) {
    this.tasks[this.count] = task;
    this.count++;
  }
}