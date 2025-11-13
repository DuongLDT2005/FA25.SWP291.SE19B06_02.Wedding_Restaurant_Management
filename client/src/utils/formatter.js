export function formatCompactCurrency(value, fallback = "— ₫") {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;

  const formatValue = (n, divisor, suffix) => {
    const result = n / divisor;
    return Number.isInteger(result)
      ? `${result}${suffix} ₫`
      : `${result.toFixed(2).replace(/\.00$/, '')}${suffix} ₫`;
  };

  if (num >= 1_000_000_000) return formatValue(num, 1_000_000_000, "B");
  if (num >= 1_000_000) return formatValue(num, 1_000_000, "M");
  if (num >= 1_000) return formatValue(num, 1_000, "K");
  return `${num.toLocaleString("vi-VN")} ₫`;
}

export function formatFullCurrency(value, fallback = "—") {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return num.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
