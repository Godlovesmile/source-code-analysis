// src/index.ts

/**
 * 判断对象
 */
export const isObject = (value: unknown) => {
  return typeof value === 'object' && value !== null
}

/**
 * 判断字符串
 */
export const isString = (value: unknown) => {
  return typeof value === 'string'
}

/**
 * 判断数字
 */
export const isNumber = (value: unknown) => {
  return typeof value === 'number'
}

/**
 * 判断数组
 */
export const isArray = Array.isArray

export const extend = Object.assign

/**
 * 判断值是否改变
 * @param value 
 * @param oldValue 
 * @returns 
 */
export function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue)
}