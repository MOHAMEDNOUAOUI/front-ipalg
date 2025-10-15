import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-costume-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './costume-select.component.html',
  styleUrl: './costume-select.component.scss',
})
export class CostumeSelectComponent {
  options = [
    { id: '1', label: 'Option One' },
    { id: '2', label: 'Option Two' },
    { id: '3', label: 'Option Three' },
  ];

  selectedOption: { id: string; label: string } | null = null;
  dropdownOpen = false;

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  selectOption(option: { id: string; label: string }) {
    this.selectedOption = option;
    this;
  }
}
