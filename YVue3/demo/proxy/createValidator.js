// 1. 校验器
const target = {
  _id: '888',
  name: 'ylz',
}
const validator = {
  name (val) {
    return typeof val === 'string'
  },
  _id (val) {
    return typeof val === 'number' && val > 1024
  }
}

const createValidator = (target, validator) => {
  return new Proxy(target, {
    _validator: validator,
    set (target, propkey, value, proxy) {
      const validator = this._validator[propkey](value)

      if (validator) {
        return Reflect.set(target, propkey, value, proxy)
      } else {
        throw Error(`Cannot set ${propkey} to ${value}. Invalid type`)
      }
    },
  })
}

const proxy = createValidator(target, validator)

// proxy.name = 'kkk'
// proxy.name = 888 // error
// proxy._id = 777 // error

console.log('=== proxy ===', proxy)