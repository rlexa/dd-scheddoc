import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, TrackByFunction} from '@angular/core';
import {RouterModule} from '@angular/router';
import {distinctUntilChanged, map} from 'rxjs';
import {DiDbUsers, DiSelectedUser} from 'src/app/data';
import {DbUser} from 'src/app/data/db';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, ScrollingModule],
})
export class UsersComponent {
  protected readonly users$ = inject(DiDbUsers);
  private readonly selectedUser$ = inject(DiSelectedUser);

  protected readonly selectedName$ = this.selectedUser$.pipe(
    map((ii) => ii?.name),
    distinctUntilChanged(),
  );

  pointerInList = false;

  protected readonly trackBy: TrackByFunction<DbUser> = (_, item) => item.id;
}
