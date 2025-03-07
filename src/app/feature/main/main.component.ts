import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';
import {DiUser} from 'src/app/data/active';
import {SignInDirective} from './sign-in';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        position: relative;
        height: 100%;

        .mat-toolbar {
          background-color: var(--mat-sys-primary-container);

          nav {
            .active {
              background-color: var(--mat-sys-tertiary-container);
              color: var(--mat-sys-on-tertiary-container);
            }
          }

          .avatar-image {
            background-size: cover;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            object-fit: cover;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule, RouterModule],
  hostDirectives: [SignInDirective],
})
export class MainComponent {
  private readonly auth = inject(Auth);
  protected readonly user$ = inject(DiUser);

  protected async logout() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Sign Out Error', error);
    }
  }
}
