import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation-pop-up',
  imports: [],
  templateUrl: './confirmation-pop-up.html',
  styleUrl: './confirmation-pop-up.scss',
})
export class ConfirmationPopUp {
  @Input() confirmDialogConfig: any;
  @Output() confirmed = new EventEmitter<boolean>(false);
  @Output() canceled = new EventEmitter<boolean>(false);
  @Output() supprimer = new EventEmitter<boolean>(false);
  @Output() closed = new EventEmitter<boolean>(false);

  close() {
    this.closed.emit(true);
  }

  confirm() {
    this.confirmed.emit(true);
  }

  cancel() {
    this.canceled.emit(true);
  }

  delete() {
    this.supprimer.emit(true);
  }
}
