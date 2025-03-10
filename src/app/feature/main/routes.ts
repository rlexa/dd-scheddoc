import {Route} from '@angular/router';
import {canActivateAsAdmin} from 'src/app/shared/can-activate-as-admin';
import {RouteUsers} from 'src/routing';
import {MainComponent} from './main.component';

export default [
  {
    path: '',
    loadComponent: () => MainComponent,
    children: [
      {path: RouteUsers, loadChildren: () => import('../users/routes'), canActivate: [canActivateAsAdmin]},
      {path: '**', pathMatch: 'prefix', redirectTo: ''},
    ],
  },
] as Route[];
