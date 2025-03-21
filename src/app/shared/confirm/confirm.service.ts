import {Injectable, inject} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {catchError, map, of} from 'rxjs';
import {ConfirmDialogComponent} from './confirm-dialog.component';

@Injectable({providedIn: 'root'})
export class ConfirmService {
  private readonly matDialog = inject(MatDialog);

  confirm$ = () =>
    this.matDialog
      .open(ConfirmDialogComponent, {
        autoFocus: '.mat-mdc-dialog-actions > button:first-child',
        minWidth: '25rem',
        hasBackdrop: true,
      })
      .afterClosed()
      .pipe(
        map((ret) => !!ret),
        catchError(() => of(false)),
      );
}
