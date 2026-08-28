export const target = process.env.FOUNDATION_TARGET === 'reference' ? 'reference' : 'work';

export function lessonUrl(id, extension = 'mjs') {
  return new URL(`../${target}/${id.toLowerCase()}.${extension}`, import.meta.url);
}
