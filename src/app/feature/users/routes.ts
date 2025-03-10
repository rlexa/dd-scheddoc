import {Route} from '@angular/router';
import {RouteParamUserId} from 'src/routing';
import {UsersComponent} from './users.component';

export default [
  {
    path: '',
    loadComponent: () => UsersComponent,
    children: [{path: `:${RouteParamUserId}`, loadChildren: () => import('../user/routes')}],
  },
] as Route[];
