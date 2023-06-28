export class Utils {
  static slugfy(value: string) {
    return value
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\S-]+/g, '')
      .replace(/--+/g, '-');
  }
}
