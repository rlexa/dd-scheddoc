import {ChangeDetectionStrategy, Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {SignInDirective} from './shared/sign-in';

@Component({
  selector: 'app-root',
  template: `<router-outlet />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  hostDirectives: [SignInDirective],
})
export class AppComponent {}
