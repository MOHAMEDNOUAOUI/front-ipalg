import { Component, EventEmitter, Output } from '@angular/core';
import {
  PButtonComponent,
  Severity,
} from '../../shared/p-button/p-button.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CostumeSelectComponent } from '../costume-select/costume-select.component';

@Component({
  selector: 'app-utilisateur-create',
  standalone: true,
  imports: [
    PButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    CostumeSelectComponent,
  ],
  templateUrl: './utilisateur-create.component.html',
  styleUrl: './utilisateur-create.component.scss',
})
export class UtilisateurCreateComponent {
  severity = Severity;
  @Output() cancel = new EventEmitter<boolean>(false);

  canceling() {
    this.cancel.emit(true);
  }

  phoneForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.phoneForm = this.fb.group({
      phone: [undefined, [Validators.required]],
    });
  }
}
