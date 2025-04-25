import {DestroyRef, inject, Injectable, OnDestroy} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatDialog} from '@angular/material/dialog';
import {catchError, exhaustMap, of, Subject} from 'rxjs';
import {AssignmentsInfoDialogComponent, AssignmentsInfoDialogComponentData} from './month-assignment/assignments-info';

@Injectable()
export class AssignmentInfoActionService implements OnDestroy {
  private readonly destroyRef = inject(DestroyRef);
  private readonly matDialog = inject(MatDialog);

  private readonly trigger$ = new Subject<AssignmentsInfoDialogComponentData>();

  constructor() {
    this.init();
  }

  ngOnDestroy() {
    this.trigger$.complete();
  }

  private init() {
    this.trigger$
      .pipe(
        exhaustMap((data) =>
          this.matDialog
            .open(AssignmentsInfoDialogComponent, {data})
            .afterClosed()
            .pipe(catchError(() => of('meh'))),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  readonly trigger = (val: AssignmentsInfoDialogComponentData) => this.trigger$.next(val);
}
