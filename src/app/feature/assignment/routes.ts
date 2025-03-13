import {Route} from '@angular/router';
import {AssignmentComponent} from './assignment.component';

export default [{path: '', loadComponent: () => AssignmentComponent}] as Route[];
