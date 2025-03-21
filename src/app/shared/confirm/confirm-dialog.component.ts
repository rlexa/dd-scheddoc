import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDialogModule],
})
export class ConfirmDialogComponent {
  private readonly matDialogRef = inject(MatDialogRef);

  protected readonly confirm = () => this.matDialogRef.close(true);
  protected readonly cancel = () => this.matDialogRef.close(false);
}
