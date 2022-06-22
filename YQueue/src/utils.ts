export function isJsonObject(target: any) {
  return typeof target === 'object' && Object.prototype.toString.call(target) === '[object Object]';
}