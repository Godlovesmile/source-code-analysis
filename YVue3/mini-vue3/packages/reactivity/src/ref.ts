export class RefImpl {
  private _value

  constructor(value) {
    this._value = value
  }

  get value() {
    return this._value
  }
}

function createRef(value) {
  const refImpl = new RefImpl(value)

  return refImpl
}

export function ref(value?: unknown) {
  return createRef(value)
}
