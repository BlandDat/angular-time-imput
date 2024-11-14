import {ComponentFixture, TestBed, tick} from '@angular/core/testing';
import { TimeInputComponent } from './time-input.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { TimeFormat } from '../../abstract/input-format.enum';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('TimeInputComponent', () => {
  let component: TimeInputComponent;
  let fixture: ComponentFixture<TimeInputComponent>;
  let inputEl: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, MatInputModule, BrowserAnimationsModule],
      providers: [],
    }).compileComponents()

    fixture = TestBed.createComponent(TimeInputComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input')).nativeElement;
    fixture.detectChanges();
  });


  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default separator ":" when none is provided', () => {
    expect(component.separator).toBe(':');
  });

  it('should apply custom separator if valid', () => {
    component.separator = '-';
    fixture.detectChanges();
    expect(component.separator).toBe('-');
  });

  it('should write value and format it correctly on 24-hour format', () => {
    component.format = TimeFormat.Twenty;
    component.writeValue('1345');
    fixture.detectChanges();
    expect(inputEl.value).toBe('13:45');
  });

  it('should write value and format it correctly on 12-hour format', () => {
    component.format = TimeFormat.Twelve;
    component.writeValue('0115');
    fixture.detectChanges();
    expect(inputEl.value).toBe('01:15');
  });

  it('should register onChange and onTouch functions', () => {
    const onChangeFn = jasmine.createSpy('onChange');
    const onTouchFn = jasmine.createSpy('onTouch');

    component.registerOnChange(onChangeFn);
    component.registerOnTouched(onTouchFn);

    component.onChange('13:45');
    component.onTouch();

    expect(onChangeFn).toHaveBeenCalledWith('13:45');
    expect(onTouchFn).toHaveBeenCalled();
  });

  it('should format time with custom separator on input', () => {
    component.separator = '-';
    component.format = TimeFormat.Twenty;
    component.writeValue('1030');
    fixture.detectChanges();
    expect(inputEl.value).toBe('10-30');
  });

  it('should call onChange when focus is lost', () => {
    const onChangeFn = jasmine.createSpy('onChange');
    component.registerOnChange(onChangeFn);
    component.timeValue.set('12:00');
    component.focusOut();
    expect(onChangeFn).toHaveBeenCalledWith('12:00');
  });

  it('should set time value correctly when a valid time is input', () => {
    component.writeValue('1415');
    const onChangeFn = jasmine.createSpy('onChange');
    component.registerOnChange(onChangeFn);
    component.focusOut();
    expect(component.timeValue()).toBe('14:15');
  });

  it('should reset time value to null when an invalid time is input', () => {
    const onChangeFn = jasmine.createSpy('onChange');
    component.registerOnChange(onChangeFn);
    component.writeValue('2560');
    inputEl.focus();
    component.focusOut();
    expect(component.timeValue()).toBe('23:59' || '12:59')
  });

  it('should handle backspace correctly by removing last digit', () => {
    component.writeValue('1200');
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    spyOn(component, 'handleKeydown').and.callThrough();

    Object.defineProperty(event, 'target', { writable: false, value: inputEl });

    inputEl.value = '12:05';
    inputEl.selectionStart = 4;

    inputEl.focus();
    component.handleKeydown(event);
    fixture.detectChanges();

    expect(component.timeValue()).toBe('12:00');
  });
});
