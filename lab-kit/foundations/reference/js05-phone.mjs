export function normalizePhone(phone) {
  if (typeof phone !== 'string') throw new Error('Phone must be text');
  let normalized = phone.trim().replaceAll(/[ .-]/g, '');
  if (normalized.startsWith('+84')) normalized = `0${normalized.slice(3)}`;
  if (!/^0\d{9}$/.test(normalized)) throw new Error(`Invalid stored phone: ${phone}`);
  return normalized;
}
