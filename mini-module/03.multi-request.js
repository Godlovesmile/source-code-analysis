/**
 * js 实现请求并发控制
 * 实现一个批量请求函数 multiRequest(urls, maxNum)，要求如下：
 * 要求最大并发数 maxNum
 * 每当有一个请求返回，就留下一个空位，可以增加新的请求
 * 所有请求完成后，结果按照 urls 里面的顺序依次打出
 */

const p = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      console.log("1000");
      resolve('1000');
    }, 1000);
  });
};

const p1 = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      console.log("2000");
      resolve('2000');
    }, 2000);
  });
};

const p2 = function () {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      console.log("3000");
      resolve('3000');
    }, 3000);
  });
};

function multiRequest(urls, maxNum) {
  const len = urls.length;
  const queue = new Array(len).fill(false);
  let count = 0;

  return new Promise(function (resolve, reject) {
    while (count < maxNum) {
      next();
    }

    function next() {
      let current = count++;

      if (current >= len) {
        !queue.includes(false) && resolve(queue);
        return;
      }

      const p = urls[current];
      console.log(`开始 ${current}`, new Date().toLocaleString());

      p().then(res => {
        queue[current] = res;
        console.log(`完成 ${current}`, new Date().toLocaleString());
        // resolve(res)

        if (current < len) {
          next();
        }
      }).catch(err => {
        console.log(`失败 ${current}`, new Date().toLocaleString());
        queue[current] = err;

        if (current < len) {
          next();
        }
      })
    }
  })
}

multiRequest([p, p1, p2], 4).then(res => {
  console.log('=== res ===', res);
})