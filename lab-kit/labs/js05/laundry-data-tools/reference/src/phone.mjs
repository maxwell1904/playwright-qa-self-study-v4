export function normalizePhone(phone) {
  let normalized = phone.trim().replaceAll(/[ .-]/g, '');
  if (normalized.startsWith('+84')) normalized = `0${normalized.slice(3)}`;
  if (!/^0\d{9}$/.test(normalized)) throw new Error('Invalid phone');
  return normalized;
}
