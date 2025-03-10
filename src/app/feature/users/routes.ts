import {Route} from '@angular/router';
import {UsersComponent} from './users.component';

export default [{path: '', loadComponent: () => UsersComponent}] as Route[];
