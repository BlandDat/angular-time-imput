import {NumberRegexp, TimeFormatRegexp} from '../const/time-input.regexp';
import {TimeFormat} from './input-format.enum';

export abstract class TimeInput {

  protected abstract separator: string;
  protected abstract format: TimeFormat;

  protected applyMask(value: string): string {

    const numericValue = value.replace(/\D/g, '');

    let paddedValue = numericValue.length === 3 ? '0' + numericValue : numericValue;

    let hours = paddedValue.slice(0, 2);
    let minutes = paddedValue.slice(2, 4);

    if (this.format === TimeFormat.Twelve) {

      if (parseInt(hours, 10) > 12) {
        hours = '12';
      }
    } else {

      if (parseInt(hours, 10) > 23) {
        hours = '23';
      }
    }

    if (parseInt(minutes, 10) > 59) {
      minutes = '59';
    }

    minutes = minutes.padEnd(2, '0');

    return `${hours}${this.separator}${minutes}`;
  }

  protected switchSymbol(value: string, selectionStart: number, newDigit: string): [string, boolean] {

    if (!NumberRegexp.test(newDigit)) {
      return [value, false];
    }

    let [hours, minutes] = value.split(this.separator);
    const digit = parseInt(newDigit, 10);

    if (selectionStart < 0 || selectionStart > value.length - 1) return [value, true];

    if (this.format === TimeFormat.Twelve) {
      if (selectionStart === 0) {
        hours = `${digit}${hours[1]}`;
        if (parseInt(hours, 10) > 12) hours = "12";
        else if (parseInt(hours, 10) === 0) hours = "01";
      } else if (selectionStart === 1) {
        hours = `${hours[0]}${digit}`;
        if (parseInt(hours, 10) > 12) hours = "12";
      }
    }

    if (this.format === TimeFormat.Twenty) {
      if (selectionStart === 0) {
        hours = `${digit}${hours[1]}`;
        if (parseInt(hours, 10) > 23) hours = "23";
      } else if (selectionStart === 1) {
        hours = `${hours[0]}${digit}`;
        if (parseInt(hours, 10) > 23) hours = "23";
      }
    }

    if (selectionStart === 3) {
      minutes = `${digit}${minutes[1]}`;
      if (parseInt(minutes, 10) > 59) minutes = "59";
    } else if (selectionStart === 4) {
      minutes = `${minutes[0]}${digit}`;
      if (parseInt(minutes, 10) > 59) minutes = "59";
    }

    return [`${hours}${this.separator}${minutes}`, true];
  }

  protected isValidTime(time: string): boolean {
    return TimeFormatRegexp(this.separator).test(time ?? '');
  }

  protected isAllowedKey(key: string): boolean {
    const allowedKeys = [
      'Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Delete',
      'Home', 'End', 'Enter', 'Escape', 'Meta'
    ];

    return allowedKeys.includes(key);
  }
}
