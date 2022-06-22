declare type PromiseResult<R> = R extends () => infer P ? P extends Promise<infer Result> ? Result : P : R extends Promise<infer S> ? S : R;
export declare type QueueResult<R> = R extends [infer F, ...infer N] ? [PromiseResult<F>, ...QueueResult<N>] : R extends [] ? R : R extends Array<infer S> ? PromiseResult<S>[] : R[];
export interface Options {
    max?: number;
    interval?: number;
}
export {};
