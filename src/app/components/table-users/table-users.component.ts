import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { PButtonComponent, Severity } from '../../shared/p-button/p-button.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { environment } from '../../environments/environment';
import { statusUtilisateur, Utilisateur } from '../../Models/Utilisateur/Utilisateurs';
import { UsersStore } from '../../store/users.store';
import { FormsModule } from '@angular/forms';
import { EllipsisInterface } from '../../interfaces/Table-helper';

@Component({
  selector: 'app-table-users',
  standalone: true,
  imports: [PButtonComponent, CommonModule, PaginationComponent, FormsModule],
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.scss',
})
export class TableUsersComponent {
  @Input() store: any;
  severity = Severity;
  @Input() columns: any[] = [];
  @Input() page: string = '';
  @Input() icon: string = '';
  @Input() ellipsis: boolean = false;
  @Input() maxHeight: string = '';
  @Input() ellipsisItems: EllipsisInterface[] = [];

  constructor() {}

  //Utilisateur
  statusUtilisateur = statusUtilisateur;

  popupTop: number = 0;
  popupRight: number = 0;
  selectedRow: any | null = null;
  popupVisible = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.popup') && !target.closest('.pi-ellipsis-v')) {
      this.popupVisible = false;
      this.selectedRow = null;
    }
  }

  ngOnInit() {}

  getValue(column: any, row: any) {
    if (column.item) {
      return row[column.value][column.item];
    } else {
      return row[column.value];
    }
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  changePage(page: number) {
    this.store.updateFilter({ page: page });
  }

  changeSearch(event: any) {
    let value = event.target.value;
    this.store.updateFilter({ search: value });
  }

  openPopUp(row: any, i: number, event: MouseEvent) {
    let sameRow = false;
    if (this.selectedRow && this.selectedRow.id === row.id) {
      sameRow = true;
    }
    if (sameRow) {
      this.selectedRow = null;
      this.popupVisible = false;
      return;
    }
    this.selectedRow = row;
    this.popupVisible = true;

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Position popup just below and to the right of the icon
    this.popupTop = rect.bottom + window.scrollY + 5; // Add scrollY in case the page is scrolled
    this.popupRight = window.innerWidth - rect.right;
  }
}
