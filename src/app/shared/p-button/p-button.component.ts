import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

export enum Variant {
  text = 'text',
}
export enum Severity {
  Primary = 'Primary',
  Secondary = 'Secondary',
  Success = 'Success',
  Warn = 'Warn',
  Help = 'Help',
  Danger = 'Danger',
  Dark = 'Dark',
}
@Component({
  selector: 'app-p-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './p-button.component.html',
  styleUrl: './p-button.component.scss',
})
export class PButtonComponent {
  @Input() label?: string; // text of button
  @Input() outline?: boolean; // outline or not
  @Input() variant?: Variant; // this is
  @Input() severity?: Severity; // this is the colors
  @Input() rounded?: boolean;
  @Input() icon?: string; // rounded or not
  Severity = Severity;
  Variant = Variant;
}
