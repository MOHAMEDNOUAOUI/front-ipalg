import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import {
  PButtonComponent,
  Severity,
} from '../../shared/p-button/p-button.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { environment } from '../../environments/environment';
import {
  statusUtilisateur,
  Utilisateur,
} from '../../Models/Utilisateur/Utilisateurs';

@Component({
  selector: 'app-table-users',
  standalone: true,
  imports: [PButtonComponent, CommonModule, PaginationComponent],
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.scss',
})
export class TableUsersComponent {
  severity = Severity;
  @Input() columns: any[] = [];
  @Input() data: any = [];
  @Input() page: string = '';
  @Input() size: number = 0;
  @Input() activeSize = false;
  @Input() totalElements: number = 0;
  @Input() currentPage = 0;
  @Input() totalPages = 10;
  @Input() exporter: boolean = false;
  @Input() importer: boolean = false;
  @Input() icon: string = '';
  @Input() maxHeight: string = '';
  @Input() ellipsis = false;
  @Input() delete = false;
  @Input() modifier = false;

  columnWithEmail = {
    label: 'Email address',
    value: 'email',
  };

  //Utilisateur
  statusUtilisateur = statusUtilisateur;

  @Output() filter = new EventEmitter<boolean>(false);
  @Output() supprimer = new EventEmitter<{
    confirmed: boolean;
    user: Utilisateur;
  }>();
  @Output() Modifier = new EventEmitter<{
    confirmed: boolean;
    user: Utilisateur;
  }>();
  @Output() Ajouter = new EventEmitter<boolean>(false);

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

  items: any[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.edit(),
    },
  ];

  edit() {}

  getValue(column: any, row: any): string {
    console.log('Column:', column);
    console.log('Row:', row);

    if (Array.isArray(column.value)) {
      return column.value
        .map((v: any) => {
          const base = row[v.value];
          const result = v.item ? base?.[v.item] : base;
          return result;
        })
        .filter((val: any) => val !== undefined && val !== null)
        .join(' ');
    } else {
      const base = row[column.value];
      const result = column.item ? base?.[column.item] : base;

      return result;
    }
  }

  changePage(page: number) {
    this.currentPage = page;
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

  FilterClick() {
    this.filter.emit(true);
  }
  DeleteClick(User?: Utilisateur) {
    let user = User ? User : this.selectedRow;
    this.supprimer.emit({ confirmed: true, user });
  }
  AjouterClick() {
    this.Ajouter.emit(true);
  }
  ModifierClick(User?: Utilisateur) {
    let user = User ? User : this.selectedRow;
    this.Modifier.emit({ confirmed: true, user });
  }
  ExporterClick() {}
  ImporterClick() {}
}
