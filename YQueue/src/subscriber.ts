type ListenerOptions<D = unknown> = {
  taskStatus: 'success' | 'error'
  data: D extends ArrayLike<any> ? D[number] : unknown
  taskIndex: number
}

export type Listener<R = unknown> = (listenerOptions: Partial<ListenerOptions<R>>) => void

export class Subscriber {
  subscribe(listener: Listener): () => void {

    const unsubscribe = function unsubscribe() {}.bind(this)

    return unsubscribe
  }
}