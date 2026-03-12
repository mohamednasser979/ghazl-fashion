const TRUE_SOLD_OUT_VALUES = new Set([
  "true",
  "1",
  "yes",
  "on",
  "soldout",
  "sold out"
]);

const FALSE_SOLD_OUT_VALUES = new Set([
  "false",
  "0",
  "no",
  "off",
  "available",
  "in stock"
]);

export const parseSoldOutFlag = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (TRUE_SOLD_OUT_VALUES.has(normalized)) {
      return true;
    }

    if (FALSE_SOLD_OUT_VALUES.has(normalized)) {
      return false;
    }
  }

  return false;
};

export const resolveSoldOutValue = (product) => {
  if (!product || typeof product !== "object") {
    return false;
  }

  const valueCandidates = [product.soldOut, product.soldout, product.isSoldOut];

  for (const candidate of valueCandidates) {
    if (candidate !== undefined && candidate !== null && candidate !== "") {
      return parseSoldOutFlag(candidate);
    }
  }

  const stockCandidates = [product.stock, product.quantity, product.inventory];

  for (const candidate of stockCandidates) {
    const numericValue = Number(candidate);
    if (Number.isFinite(numericValue)) {
      return numericValue <= 0;
    }
  }

  return false;
};
