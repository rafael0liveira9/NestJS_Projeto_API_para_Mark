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

  static calendarMonths(index: number) {
    let months = [
      'Janeiro',
      'Feveiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    return months[index];
  }
}
