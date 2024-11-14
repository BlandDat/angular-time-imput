import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  signal, ViewChild
} from '@angular/core';
import {InputFormat, Separator} from '../../abstract/input-format.type';
import {ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {TimeInput} from '../../abstract/time-input.abstract';
import {isString} from '../../../../type-guards/string.guard';
import {NumberRegexp, TimeSeparatorRegexp} from '../../const/time-input.regexp';
import {TimeFormat} from '../../abstract/input-format.enum';

@Component({
  selector: 'time-input',
  standalone: true,
  exportAs: 'time-input',
  imports: [
    MatFormField,
    MatInputModule,
    ReactiveFormsModule
  ],
  templateUrl: './time-input.component.html',
  styleUrl: './time-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimeInputComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeInputComponent extends TimeInput implements ControlValueAccessor {
  @Input({required: false, transform: (data: InputFormat) => {
      return TimeSeparatorRegexp.test(data) ? data[2] : ':'
    }}) public separator: Separator = ':'

  @Input() public format = TimeFormat.Twenty

  @ViewChild(MatInput, { static: true }) public timeInput!: MatInput;

  public readonly timeValue = signal<string | null>(null);

  public onChange!: ((value: unknown) => void);
  public onTouch!: (() => void);

  public registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  public writeValue(value: unknown): void {
    if (!isString(value)) {
      return;
    }

    this._setTime(value);
    this.timeInput.value = this.timeValue();
  }

  public handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;

    let value = target.value;

    this._setTime(value);
  }

  public handleKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLInputElement;
    const selection = Number(target.selectionStart);
    let value = target.value;
    let success = false;

    if (this.isAllowedKey(event.key)) {
      return;
    }

    if (!NumberRegexp.test(event.key)) {
      event.preventDefault();
      return;
    }

    if (selection >= target.value.length) {
      return;
    }

    [value, success] = this.switchSymbol(target.value, selection,  event.key);

    target.value = value

    if (!success) {
      event.stopPropagation();
    }

    target.selectionStart = selection + 1;
    target.selectionEnd = selection + 1;

    this._setTime(value);

    event.stopPropagation();
    event.preventDefault();
  }

  public focusOut(): void {
    const value = this.timeValue();

    this.timeInput.value = value;

    this.onChange(value);
  }

  private _setTime(value: string): void {

    if (value) {
      value = this.applyMask(value);
    }

    if (this.isValidTime(value)) {
      this.timeValue.set(value);
    } else {
      this.timeValue.set(null);
    }
  }


}
