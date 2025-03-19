import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, TrackByFunction} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {catchError, distinctUntilChanged, exhaustMap, map, of, Subject} from 'rxjs';
import {DiDbUsers, DiSelectedUser} from 'src/app/data';
import {DbUser} from 'src/app/data/db';
import {AddUserDialogComponent} from './add-user-dialog';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule, RouterModule, ScrollingModule],
})
export class UsersComponent implements OnDestroy, OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly matDialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly selectedUser$ = inject(DiSelectedUser);
  protected readonly users$ = inject(DiDbUsers);

  private readonly triggerAdd$ = new Subject<void>();

  protected readonly selectedName$ = this.selectedUser$.pipe(
    map((ii) => ii?.name),
    distinctUntilChanged(),
  );

  pointerInList = false;

  ngOnDestroy() {
    this.triggerAdd$.complete();
  }

  ngOnInit() {
    this.triggerAdd$
      .pipe(
        exhaustMap(() =>
          this.matDialog
            .open(AddUserDialogComponent)
            .afterClosed()
            .pipe(catchError(() => of(false))),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        if (typeof response === 'string' && !!response) {
          this.router.navigate([response], {relativeTo: this.activatedRoute});
        }
      });
  }

  protected readonly trackBy: TrackByFunction<DbUser> = (_, item) => item.id;

  protected readonly addUser = () => this.triggerAdd$.next();
}
