import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Severity, Variant } from '../p-button/p-button.component';

@Component({
  selector: 'app-p-button-second',
  imports: [CommonModule],
  templateUrl: './p-button-second.html',
  styleUrl: './p-button-second.scss',
})
export class PButtonSecond {
  @Input() label?: string; // text of button
  @Input() outline?: boolean; // outline or not
  @Input() variant?: Variant; // this is
  @Input() severity?: Severity; // this is the colors
  @Input() rounded?: boolean;
  @Input() icon?: string; // rounded or not
  Severity = Severity;
  Variant = Variant;
}
