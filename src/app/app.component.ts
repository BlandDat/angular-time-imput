import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {TimeInputComponent} from './shared/features/form/components/time-input/time-input.component';
import {MatFormField, MatInput, MatInputModule} from '@angular/material/input';
import {AsyncPipe, JsonPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TimeInputComponent, MatInput, MatFormField, MatInputModule, ReactiveFormsModule, JsonPipe, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  private readonly _fb = inject(FormBuilder)

  public form = this._fb.group({
    'input-24h' : '1233',
    'input-12h' : '',
    'input-24h-custom' : '',
  })
}
