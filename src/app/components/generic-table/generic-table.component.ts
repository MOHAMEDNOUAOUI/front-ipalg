import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { PButtonComponent, Severity } from '../../shared/p-button/p-button.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { environment } from '../../environments/environment';
import { statusUtilisateur, Utilisateur } from '../../Models/Utilisateur/Utilisateurs';
import { UsersStore } from '../../store/users.store';
import { FormsModule } from '@angular/forms';
import { EllipsisInterface } from '../../interfaces/Table-helper';
import { BaseFilter, BaseStore } from '../../store/type.generic';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [PButtonComponent, CommonModule, PaginationComponent, FormsModule],
  templateUrl: './generic-table-component.html',
  styleUrl: './generic-table-component.scss',
})
export class GenericTableComponent<T, F extends BaseFilter, TStore extends BaseStore<T, F>> {
  // T equals Data type , F equals Filter type , TStore equals Store type
  @Input() store!: TStore;
  severity = Severity;
  @Input() columns: any[] = [];
  @Input() page: string = '';
  @Input() icon: string = '';
  @Input() ellipsis: boolean = false;
  @Input() maxHeight: string = '';
  @Input() ellipsisItems: EllipsisInterface[] = [];
  @Output() actionEvent = new EventEmitter<string>();

  constructor() {}

  //Utilisateur
  statusUtilisateur = statusUtilisateur;

  popupTop: number = 0;
  popupRight: number = 0;
  popupVisible = false;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.popup') && !target.closest('.pi-ellipsis-v')) {
      this.popupVisible = false;
      this.store.setSelectedData(null);
    }
  }
  // Safe property access - TypeScript now knows T has these properties
  getProperty(item: T, key: string): any {
    return (item as any)[key];
  }

  trackByFn(index: number, item: T): string {
    // Assuming all items have an id property
    return (item as any).id || index;
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

  changeFilter<K extends keyof F>(partial: Pick<F, K>) {
    this.store.updateFilter(partial as Partial<F>);
  }

  changeSearch(event: any) {
    let value = event.target.value;
    this.store.updateSearch(value);
  }

  openPopUp(row: any, i: number, event: MouseEvent) {
    let sameRow = false;
    const selected = this.store.selectedData();
    if (selected && (selected as any).id === row.id) {
      sameRow = true;
    }
    if (sameRow) {
      this.store.setSelectedData(null);
      this.popupVisible = false;
      return;
    }
    this.store.setSelectedData(row);
    this.popupVisible = true;

    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Position popup just below and to the right of the icon
    this.popupTop = rect.bottom + window.scrollY + 5; // Add scrollY in case the page is scrolled
    this.popupRight = window.innerWidth - rect.right;
  }

  handleAction(action: string, row?: T) {
    if (row) {
      this.store.setSelectedData(row);
    }
    this.actionEvent.emit(action);
  }
}
