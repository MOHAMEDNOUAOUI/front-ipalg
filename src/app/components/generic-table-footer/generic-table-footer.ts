import { Component, Input } from '@angular/core';
import { BaseFilter, BaseStore } from '../../store/type.generic';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-generic-table-footer',
  imports: [PaginationComponent],
  templateUrl: './generic-table-footer.html',
  styleUrl: './generic-table-footer.scss',
})
export class GenericTableFooter<T, F extends BaseFilter, TStore extends BaseStore<T, F>> {
  @Input() store!: TStore;

  changePage(page: number) {
    this.store.updateFilter({ page: page } as Partial<F>);
  }
}
