import {Route} from '@angular/router';
import {MainComponent} from './main.component';

export default [{path: '', loadComponent: () => MainComponent}] as Route[];
