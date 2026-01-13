export function buildCartQtyMap(items) {
  const list = Array.isArray(items) ? items : [];
  const map = {};

  for (const it of list) {
    const pid = it?.product?._id || it?.product;
    if (!pid) continue;

    map[String(pid)] = Number(it?.quantity || 0);
  }

  return map;
}
