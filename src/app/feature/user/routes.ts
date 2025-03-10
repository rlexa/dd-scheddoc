import {Route} from '@angular/router';
import {UserComponent} from './user.component';

export default [{path: '', loadComponent: () => UserComponent}] as Route[];
