import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
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
import { EllipsisInterface, TableButtonsInterface } from '../../interfaces/Table-helper';
import { BaseFilter, BaseStore } from '../../store/type.generic';
import { ConfirmationPopUp } from '../confirmation-pop-up/confirmation-pop-up';
import { ActionFunctionType } from '../../utils/ActionsDistrubitorService';
import { GenericTableRowsExecution } from '../generic-table-rows-execution/generic-table-rows-execution';
import { PButtonSecond } from '../../shared/p-button-second/p-button-second';

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    PButtonComponent,
    CommonModule,
    PaginationComponent,
    FormsModule,
    ConfirmationPopUp,
    GenericTableRowsExecution,
    PButtonSecond,
  ],
  templateUrl: './generic-table-component.html',
  styleUrl: './generic-table-component.scss',
})
export class GenericTableComponent<T, F extends BaseFilter, TStore extends BaseStore<T, F>> {
  // T equals Data type , F equals Filter type , TStore equals Store type
  @Input() store!: TStore;
  @Input() buttons: TableButtonsInterface[] = [];
  severity = Severity;
  @Input() columns: any[] = [];
  @Input() page: string = '';
  @Input() icon: string = '';
  @Input() ellipsis: boolean = false;
  @Input() maxHeight: string = '';
  @Input() header: boolean = false;
  @Input() ellipsisItems: EllipsisInterface[] = [];
  @Output() actionEvent = new EventEmitter<string>();

  showUpdateAll$ = signal<boolean>(false);

  constructor() {
    effect(() => {
      const rows = this.store.selectedRowsData();
      rows.length > 0 ? this.showUpdateAll$.set(true) : this.showUpdateAll$.set(false);
    });
  }

  //Utilisateur
  statusUtilisateur = statusUtilisateur;

  popupTop: number = 0;
  popupRight: number = 0;
  popupVisible = false;
  deletePopUp = false;

  confirmDialogConfig = {
    title: '',
    message: '',
    confirmText: '',
    cancelText: '',
  };

  resetConfirmDialog() {
    this.deletePopUp = false;
    this.confirmDialogConfig = {
      title: '',
      message: '',
      confirmText: '',
      cancelText: '',
    };
  }

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

  getCheckedValue(row: any): boolean {
    return row.checked;
  }
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
  ellipsisPopUp = false;
  openEllipsis(event: MouseEvent) {
    if (this.ellipsisPopUp) {
      this.ellipsisPopUp = false;
      return;
    }
    this.ellipsisPopUp = true;
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

    if (action == ActionFunctionType.DELETE) {
      this.deletePopUp = true;
      this.confirmDialogConfig = {
        title: 'Confirmation de suppression',
        message:
          'Voulez-vous vraiment supprimer cet élément ? Cette action ne peut pas être annulée.',
        confirmText: 'Supprimer',
        cancelText: 'Annuler',
      };
    } else {
      this.actionEvent.emit(action);
    }
  }

  onConfirmDialogResult(confirmation: boolean) {
    if (confirmation) {
      this.actionEvent.emit(ActionFunctionType.DELETE);
    }
    this.resetConfirmDialog();
  }

  selectItem(item: T) {
    this.store.updateSelectedRow(item);
    if (this.store.selectedRowsData().length === 0) {
      this.isChecked = false;
    } else if (this.store.selectedRowsData().length === this.store.data().length) {
      this.isChecked = true;
    }
  }

  isChecked = false;
  checkAll(event: any) {
    console.log(event.target.checked);

    this.isChecked = event.target.checked;
    this.store.setAllRowsSelected(this.isChecked);

    console.log(this.store.data());
  }
}
