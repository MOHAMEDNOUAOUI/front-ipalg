import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() totalPages: number = 0;
  @Input() currentPage: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pages() {
    const maxVisible = 5;
    const pages: number[] = [];

    if (this.totalPages <= maxVisible) {
      for (let i = 0; i < this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(0, this.currentPage - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;

      if (end >= this.totalPages) {
        end = this.totalPages - 1;
        start = end - maxVisible + 1;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  changePage(displayPage: number) {
    if (
      displayPage >= 0 &&
      displayPage < this.totalPages &&
      displayPage !== this.currentPage // Compare with 1-based version
    ) {
      this.pageChange.emit(displayPage); // ✅ Emit 0-based to parent
    }
  }
}
