import { inject, Injectable, signal } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { ApiService } from '../core/api.service';
import { TableDataQueryParams, UrlService } from '../core/url.service';

@Injectable()
export class TableDataService {
  private urlService = inject(UrlService);
  private apiService = inject(ApiService);

  private readonly maxAvailableRecords = 1000;
  totalCount = signal(0);
  isLoading = signal(false);
  isLimitReached = signal(false);

  listenQueryParams() {
    return this.urlService.listenQueryParams();
  }

  getData() {
    return this.listenQueryParams().pipe(
      switchMap((params) => {
        this.isLoading.set(true);
        return this.apiService.getGithubIssues(params);
      }),
      map((data) => {
        this.isLoading.set(false);
        this.isLimitReached.set(data === null);

        if (data === null) return [];

        this.totalCount.set(
          data.total_count < this.maxAvailableRecords
            ? data.total_count
            : this.maxAvailableRecords,
        );
        return data.items;
      }),
    );
  }

  pageChanged(page: TableDataQueryParams['page']) {
    const params = this.urlService.getQueryParams();
    this.urlService.updateQueryParams({ ...params, page });
  }

  sortChanged(
    sort: TableDataQueryParams['sort'],
    order: TableDataQueryParams['order'],
    returnToFirstPage: boolean,
  ) {
    const params = this.urlService.getQueryParams();
    this.urlService.updateQueryParams({
      ...params,
      sort,
      order,
      page: returnToFirstPage ? 1 : params.page,
    });
  }
}
