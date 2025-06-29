export function getPagination(current, total) {
  const delta = 1;
  const range = [];
  const result = [];
  let l;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        result.push(l + 1);
      } else if (i - l > 2) {
        result.push("...");
      }
    }
    result.push(i);
    l = i;
  }

  return result;
}
