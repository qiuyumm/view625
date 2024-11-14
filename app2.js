const now = new Date();
now.setMinutes(0, 0, 0);
const localISOTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

console.log(localISOTime)
// localISOTime.setMinutes(0, 0, 0); // 将分钟、秒和毫秒设置为 0
console.log(localISOTime)