import {Route} from '@angular/router';
import {canActivateAsAdmin} from 'src/app/shared/can-activate-as-admin';
import {RouteAssignment, RouteCalendar, RouteUsers} from 'src/routing';
import {MainComponent} from './main.component';

export default [
  {
    path: '',
    loadComponent: () => MainComponent,
    children: [
      {path: RouteAssignment, loadChildren: () => import('../assignment/routes'), canActivate: [canActivateAsAdmin]},
      {path: RouteCalendar, loadChildren: () => import('../calendar/routes')},
      {path: RouteUsers, loadChildren: () => import('../users/routes'), canActivate: [canActivateAsAdmin]},
      {path: '**', pathMatch: 'prefix', redirectTo: RouteCalendar},
    ],
  },
] as Route[];
