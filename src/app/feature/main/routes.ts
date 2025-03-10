import {Route} from '@angular/router';
import {RouteUsers} from 'src/routing';
import {MainComponent} from './main.component';

export default [
  {
    path: '',
    loadComponent: () => MainComponent,
    children: [
      {path: RouteUsers, loadChildren: () => import('../users/routes')},
      {path: '**', pathMatch: 'prefix', redirectTo: ''},
    ],
  },
] as Route[];
