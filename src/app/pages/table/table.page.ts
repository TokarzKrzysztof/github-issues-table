import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AppRoutes } from '../../app.routes';

@Component({
  selector: 'app-table',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './table.page.html',
  styleUrl: './table.page.scss',
})
export class TablePage {
   AppRoutes = AppRoutes;
}
