import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';
import {DiDbUser} from 'src/app/data';
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
            height: 2.5rem;
            width: 2.5rem;
            border-radius: 50%;
            object-fit: cover;
            z-index: 1;
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
  protected readonly dbUser$ = inject(DiDbUser);

  protected async logout() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Sign Out Error', error);
    }
  }
}
