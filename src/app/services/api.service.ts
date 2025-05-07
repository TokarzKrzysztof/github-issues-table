import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TableDataQueryParams } from './url.service';

export interface GithubApi {
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

  getGithubIssues(queryParams: TableDataQueryParams): Observable<GithubApi> {
    const queryParamsWithQ = {
      q: 'repo:angular/components',
      ...queryParams,
    };
    const params = new HttpParams({ fromObject: queryParamsWithQ });

    return this.httpClient.get<GithubApi>(
      'https://api.github.com/search/issues',
      { params },
    );
  }
}
