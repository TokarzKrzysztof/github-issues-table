import { DatePipe, LowerCasePipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { GithubIssue } from '../../../core/api.service';
import { TableDataQueryParams } from '../../../core/url.service';

@Component({
  selector: 'app-data-table',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinner,
    DatePipe,
    NgTemplateOutlet,
    LowerCasePipe,
    MatIconModule
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableComponent {
  sortChange = output<Sort>();
  pageChange = output<PageEvent>();
  totalCount = input.required<number>();
  isLoading = input.required<boolean>();
  isLimitReached = input.required<boolean>();
  data = input.required<GithubIssue[] | undefined>();
  queryParams = input.required<TableDataQueryParams>();

  readonly displayedColumns = ['created', 'updated', 'title'];
  readonly dateFormatTop = 'MM-dd-yy';
  readonly dateFormatBottom = 'hh:mm:ss aa';
  readonly dateColumnWidth = 130;
  readonly typedRow = (row: any) => row as GithubIssue;
}
