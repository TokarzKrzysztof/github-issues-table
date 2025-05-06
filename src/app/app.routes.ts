import { Routes } from '@angular/router';

export enum AppRoutes {
  Home = '',
  Table = 'table',
}

export const routes: Routes = [
  {
    path: AppRoutes.Home,
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: AppRoutes.Table,
    loadComponent: () =>
      import('./pages/table/table.page').then((m) => m.TablePage),
  },
  { path: '**', redirectTo: AppRoutes.Home },
];
