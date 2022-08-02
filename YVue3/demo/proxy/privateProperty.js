// 私有属性判断
const target = {
  name: 'ylz',
  _id: '888',
}

const proxy = new Proxy(target, {
  get (target, propkey, proxy) {
    if (propkey[0] === '_') {
      throw Error(`${propkey} is private`)
    }

    return Reflect.get(target, propkey, proxy)
  },
  set (target, propkey, value, proxy) {
    if (propkey[0] === '_') {
      throw Error(`${propkey} is private`)
    }
    
    return Reflect.set(target, propkey, value, proxy)
  }
})

// console.log(proxy._id)
console.log(proxy.name)