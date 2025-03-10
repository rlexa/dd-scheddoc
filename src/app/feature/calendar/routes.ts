import {Route} from '@angular/router';
import {CalendarComponent} from './calendar.component';

export default [{path: '', loadComponent: () => CalendarComponent}] as Route[];
