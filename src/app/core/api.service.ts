import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';
import { TableDataQueryParams } from './url.service';

export interface GithubResponse {
  items: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  created_at: string;
  updated_at: string;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private httpClient = inject(HttpClient);

  private cache = new Map<string, GithubResponse>();

  getGithubIssues(
    queryParams: TableDataQueryParams,
  ): Observable<GithubResponse | null> {
    const key = JSON.stringify(queryParams);
    if (this.cache.has(key)) {
      return of(this.cache.get(key)!);
    }

    const queryParamsWithQ = {
      q: 'repo:angular/components',
      ...queryParams,
    };
    const params = new HttpParams({ fromObject: queryParamsWithQ });

    return this.httpClient
      .get<GithubResponse>('https://api.github.com/search/issues', { params })
      .pipe(
        catchError(() => of(null)),
        tap((res) => {
          if (res !== null) {
            this.cache.set(key, res);
          }
        }),
      );
  }
}
