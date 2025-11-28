import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-costume-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './costume-select.component.html',
  styleUrl: './costume-select.component.scss',
})
export class CostumeSelectComponent {
  @Input() options: any[] = [];
  @Input() selectedOptionInput: any;
  @Output() emitOption = new EventEmitter<any>();

  selectedOption: string = '';
  dropdownOpen = false;

  ngOnInit() {}

  ngAfterViewInit() {
    this.selectedOption = this.options.find((idk: any) => idk == this.selectedOptionInput);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  selectOption(option: any) {
    this.selectedOption = option;
    this.emitOption.emit(this.selectedOption);
  }
}
