import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {DbCalendar, DbUser} from 'src/app/data/db';
import {UserFrozenEntriesCountPipe} from './user-frozen-entries-count.pipe';

export interface AssignmentsInfoDialogComponentData {
  entries: DbCalendar[];
  users: DbUser[];
}

@Component({
  selector: 'app-assignments-info-dialog',
  templateUrl: './assignments-info-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDialogModule, UserFrozenEntriesCountPipe],
})
export class AssignmentsInfoDialogComponent {
  protected readonly data = inject(MAT_DIALOG_DATA) as AssignmentsInfoDialogComponentData;
  private readonly matDialogRef = inject(MatDialogRef);

  protected readonly close = () => this.matDialogRef.close();
}
