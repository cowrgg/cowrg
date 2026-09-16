export function formatToman(amount) {
  const n = Number(amount) || 0;
  return new Intl.NumberFormat("fa-IR").format(n) + " تومان";
}

export function formatNumber(n) {
  return new Intl.NumberFormat("fa-IR").format(Number(n) || 0);
}

export const SHIPPING_COST = 65000;