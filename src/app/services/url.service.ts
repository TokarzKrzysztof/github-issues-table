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

  areQueryParamsValid(): boolean {
    const current = this.getQueryParams();

    if (!['asc', 'desc'].includes(current.order)) return false;
    if (!['created', 'updated'].includes(current.sort)) return false;
    if (typeof current.page !== 'number') return false;
    if (typeof current.per_page !== 'number') return false;
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
      order: 'asc',
      page: 1,
      per_page: this.itemsPerPage,
    };
  }

  getQueryParams(): TableDataQueryParams {
    const params = this.activatedRoute.snapshot.queryParams;
    return {
      sort: params['sort'],
      order: params['order'],
      page: +params['page'],
      per_page: +params['per_page'],
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
