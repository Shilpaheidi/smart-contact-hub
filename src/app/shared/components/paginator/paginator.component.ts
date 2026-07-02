import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-paginator',
  imports: [MatPaginatorModule],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {
  @Input() length = 0;
  @Input() pageSize = 5;
  @Input() pageSizeOptions: number[] = [5];
  @Input() showFirstLastButtons = true;
  @Output() pageChange = new EventEmitter<PageEvent>();
  onPageChange(event: PageEvent): void {
    this.pageChange.emit(event);
  }
}
