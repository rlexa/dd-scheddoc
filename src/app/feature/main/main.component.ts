import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';

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

        nav {
          .active {
            background-color: var(--mat-sys-tertiary-container);
            color: var(--mat-sys-on-tertiary-container);
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatToolbarModule, RouterModule],
})
export class MainComponent {}
