import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Subject, debounceTime, takeUntil } from 'rxjs';

import { ContactService } from '../../../../core/services/contact.service';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { ToastService } from 'src/app/shared/services/toast.service';

import { TableComponent } from 'src/app/shared/components/table/table.component';
import { PaginatorComponent } from 'src/app/shared/components/paginator/paginator.component';
import { InputComponent } from 'src/app/shared/components/input/input.component';
import { ButtonComponent } from 'src/app/shared/components/button/button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatPaginatorModule,
    TableComponent,
    PaginatorComponent,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './contact-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactListComponent implements OnInit, OnDestroy {

  api = inject(ContactService);
  loader = inject(LoaderService);
  toast = inject(ToastService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();
  private search$ = new Subject<string>();

  contacts: any[] = [];
  filtered: any[] = [];
  pagedData: any[] = [];

  searchText = '';
  pageSize = 5;
  pageIndex = 0;

  tableColumns = [
    { key: 'first_name', label: 'Name' },
    { key: 'emailId', label: 'Email' },
    { key: 'mobilenumber', label: 'Mobile Number' }
  ];

  columns = this.tableColumns.map(c => c.key);

  ngOnInit(): void {
    this.initSearch();
    this.load();
  }


  private initSearch(): void {
    this.search$
      .pipe(
        debounceTime(250),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        const searchValue = (value || '').trim().toLowerCase();

        this.filtered = this.contacts.filter(c =>
          (c._name || '').includes(searchValue)
        );

        this.pageIndex = 0;
        this.updatePagedData();
      });
  }

  load(): void {
    this.loader.show();

    this.api.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {

          this.loader.hide();


          this.contacts = (res || []).map((c: any) => ({
            ...c,
            _name: (c.first_name || '').toLowerCase()
          }));


          this.filtered = [...this.contacts];

          this.pageIndex = 0;
          this.updatePagedData();


          this.cdr.markForCheck();
        },

        error: () => {
          this.loader.hide();
          this.toast.error('Failed to load contacts');

          this.contacts = [];
          this.filtered = [];
          this.pagedData = [];

          this.cdr.markForCheck();
        }
      });
  }

  navigate() {
    this.router.navigate(['/contacts/create']);
  }

  delete(contact: any): void {
    this.loader.show();

    this.api.delete(contact.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loader.hide();
          this.toast.success('Contact deleted successfully');
          this.load();
        },
        error: () => {
          this.loader.hide();
          this.toast.error('Failed to delete contact');
        }
      });
  }

  editContact(row: any) {
    this.router.navigate(['/contacts/edit', row.id]);
  }

  search(): void {
    this.search$.next(this.searchText);
  }

  updatePagedData(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;


    this.pagedData = [...this.filtered.slice(start, end)];

    this.cdr.markForCheck();
  }

  pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    this.updatePagedData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}