import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { GithubIssue } from '../../../services/api.service';
import { TableDataQueryParams } from '../../../services/url.service';

@Component({
  selector: 'app-data-table',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinner,
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

  private destroyRef = inject(DestroyRef);
  private paginator = viewChild(MatPaginator);
  private sort = viewChild(MatSort);

  readonly displayedColumns: string[] = ['created', 'updated', 'title'];
  protected typedRow = (row: any) => row as GithubIssue;

  ngAfterViewInit() {
    this.sort()!
      .sortChange.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((sort) => {
        this.sortChange.emit(sort);
      });

    this.paginator()!
      .page.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((page) => {
        this.pageChange.emit(page);
      });
  }
}
