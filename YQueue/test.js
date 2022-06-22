const { createQueue } = require('best-queue');

const p = function () {
  return new Promise(function (resolve, reject) {
    console.log('=== 1 ===');
    setTimeout(() => {
      console.log("1000");
      resolve('1000');
    }, 1000);
  });
};

const p1 = function () {
  return new Promise(function (resolve, reject) {
    console.log('=== 2 ===');
    setTimeout(() => {
      console.log("2000");
      resolve('2000');
    }, 2000);
  });
};

const p2 = function () {
  return new Promise(function (resolve, reject) {
    console.log('=== 3 ===');
    setTimeout(() => {
      console.log("3000");
      resolve('3000');
    }, 3000);
  });
};

const queue = createQueue([p, p1, p2], { max: 2 });

queue.then(res => {
  console.log(res);
});
queue.subscribe(({ taskStatus, data, taskIndex }) => {
  // 队列会在第一个任务后暂停
  console.log('=== taskIndex ===', taskStatus, data, taskIndex);
});
// setTimeout(() => {
//   // 队列在第一个任务后暂停，resume会继续执行队列
//   queue.resume();
// }, 1500);