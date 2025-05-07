import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

export type TableDataQueryParams = {
  sort: 'updated' | 'created';
  order: 'asc' | 'desc';
  page: number;
  per_page: number;
};

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  readonly itemsPerPage = 100;

  private areQueryParamsValid(): boolean {
    const current = this.getQueryParams();

    if (!['asc', 'desc'].includes(current.order)) return false;
    if (!['created', 'updated'].includes(current.sort)) return false;
    if (current.page <= 0) return false;
    if (current.per_page <= 0) return false;
    return true;
  }

  updateQueryParams(params: TableDataQueryParams) {
    return this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: params,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  getDefaultQueryParams(): TableDataQueryParams {
    return {
      sort: 'created',
      order: 'desc',
      page: 1,
      per_page: this.itemsPerPage,
    };
  }

  getQueryParams(): TableDataQueryParams {
    const params = this.activatedRoute.snapshot.queryParams;
    return {
      sort: params['sort'],
      order: params['order'],
      page: parseInt(params['page']) || 0,
      per_page: parseInt(params['per_page']) || 0,
    };
  }

  listenQueryParams() {
    return this.activatedRoute.queryParams.pipe(
      switchMap(async () => {
        if (this.areQueryParamsValid()) {
          return this.getQueryParams();
        }

        const defaults = this.getDefaultQueryParams();
        await this.updateQueryParams(defaults);

        return defaults;
      }),
    );
  }
}
