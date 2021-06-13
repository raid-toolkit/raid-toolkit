export function hex(value: number | string | bigint, width: number = 16) {
  return `${BigInt(value).toString(16).padStart(width, '0')}`;
}

export function HEX(value: number | string | bigint, width: number = 16) {
  return hex(value, width).toLocaleUpperCase();
}
