import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../app.routes';
import { TableDataService } from '../../services/table-data.service';
import { TableDataQueryParams } from '../../services/url.service';
import { DataTableComponent } from "./data-table/data-table.component";

@Component({
  selector: 'app-table',
  imports: [
    MatButtonModule,
    RouterLink,
    DataTableComponent
],
  templateUrl: './table.page.html',
  styleUrl: './table.page.scss',
  providers: [TableDataService],
})
export class TablePage {
  AppRoutes = AppRoutes;

  protected tableDataService = inject(TableDataService);
  
  data = toSignal(this.tableDataService.getData());
  queryParams = toSignal(this.tableDataService.listenQueryParams());

  sortChange(sort: Sort) {
    this.tableDataService.sortChanged(
      sort.active as TableDataQueryParams['sort'],
      sort.direction as TableDataQueryParams['order'],
      true
    );
  }

  pageChange(page: PageEvent) {
    this.tableDataService.pageChanged(page.pageIndex + 1);
  }
}
