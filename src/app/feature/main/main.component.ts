import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';
import {DiIsAdmin} from 'src/app/data';
import {DiUser} from 'src/app/data/active';
import {RouteAssignment, RouteCalendar, RouteUsers} from 'src/routing';

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
              background: color-mix(in srgb, var(--mat-sys-primary) 10%, transparent);
            }
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule, RouterModule],
})
export class MainComponent {
  private readonly auth = inject(Auth);
  protected readonly isAdmin$ = inject(DiIsAdmin);
  protected readonly user$ = inject(DiUser);

  protected readonly RouteAssignment = RouteAssignment;
  protected readonly RouteCalendar = RouteCalendar;
  protected readonly RouteUsers = RouteUsers;

  protected async logout() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Sign Out Error', error);
    }
  }
}
