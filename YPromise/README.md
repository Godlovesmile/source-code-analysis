# Promise

## 版本一

### 基本原理

1. Promise 是一个类，在执行这个类的时候会传入一个执行器，这个执行器会立即执行
2. Promise 会有三种状态: Pending 等待, Fulfilled 完成, Rejected 失败
3. 状态扭转: Pending -> Fulfilled; Pending -> Rejected
4. Promise 中使用 resolve 和 reject 两个函数来更改状态;
5. then 方法内部做但事情就是状态判断, 根据成功 or 失败, 进行不同状态的回调执行

### YPromise 核心实现

### 异步操作处理

1. 执行 then, 通过状态 pending 缓存 then 中成功失败的回调

### 多次 then 调用处理

1. 通过 onFulfilledCallbacks, onRejectedCallbacks 数组进行缓存

### then 链式调用
1. 内部在 then 处理中, 添加内部 Promise 处理