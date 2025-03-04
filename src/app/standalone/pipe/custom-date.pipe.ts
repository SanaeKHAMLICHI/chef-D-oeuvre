import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'customDatePipe',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  transform(
    value: Date | string | null,
    format: string = 'yyyy-MM-dd',
    locale: string = 'fr',
  ): string {
    if (!value) {
      return '';
    }

    let date: Date;

    if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = value;
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    return formatDate(date, format, locale);
  }
}
