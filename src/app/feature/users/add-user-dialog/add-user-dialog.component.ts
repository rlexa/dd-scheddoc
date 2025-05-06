import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {collection, doc, Firestore, setDoc} from '@angular/fire/firestore';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {notNullUndefined} from 'dd-rxjs';
import {filter, startWith, Subject, switchMap} from 'rxjs';
import {collectionUser, DbUser, DbUserGroup, DbUserQualification, qualificationsGerman} from 'src/app/data/db';
import {msSecond} from 'src/util-date';

@Component({
  selector: 'app-add-user-dialog',
  templateUrl: './add-user-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatDialogModule, MatInputModule, MatSelectModule, MatSnackBarModule, ReactiveFormsModule],
})
export class AddUserDialogComponent implements OnDestroy, OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly firestore = inject(Firestore);
  private readonly matDialogRef = inject(MatDialogRef);
  private readonly matSnackBar = inject(MatSnackBar);

  private readonly triggerAdd$ = new Subject<void>();

  protected readonly formGroup = new FormGroup({
    group: new FormControl<DbUserGroup | null>(null, [Validators.required]),
    name: new FormControl<string | null>(null, [Validators.required]),
    qualification: new FormControl<DbUserQualification | null>(null, [Validators.required]),
  });

  protected readonly groups: DbUserGroup[] = [DbUserGroup.Admin, DbUserGroup.User];
  protected readonly qualifications: DbUserQualification[] = [
    DbUserQualification.SeniorPhysician,
    DbUserQualification.IntensiveCareUnit,
    DbUserQualification.EmergencyRoom,
    DbUserQualification.ThirdService,
    DbUserQualification.Test,
  ];
  protected readonly qualificationsGerman = qualificationsGerman;

  ngOnDestroy() {
    this.triggerAdd$.complete();
  }

  ngOnInit() {
    this.formGroup.controls.group.setValue(DbUserGroup.User);
    this.formGroup.controls.qualification.setValue(DbUserQualification.ThirdService);

    this.formGroup.valueChanges
      .pipe(
        startWith(this.formGroup.value),
        switchMap((value) =>
          this.triggerAdd$.pipe(
            filter(() => [value.group, value.name, value.qualification].every((ii) => notNullUndefined(ii?.trim()))),
            switchMap(async () => {
              const user: DbUser = {
                group: value.group,
                isManual: true,
                name: value.name,
                qualification: value.qualification,
              };
              const collectionRef = collection(this.firestore, collectionUser);
              const docRef = doc(collectionRef);
              const id = docRef.id;

              try {
                await setDoc(docRef, {...user});
                return id;
              } catch (err) {
                console.error('Failed to add user.', err);
                this.matSnackBar.open('Kandidat nicht hinzugefügt', 'OK', {politeness: 'assertive'});
              }

              return false;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((success) => {
        if (success) {
          this.matSnackBar.open('Hizugefügt.', 'OK', {duration: 2 * msSecond});
          this.matDialogRef.close(success);
        }
      });
  }

  protected readonly add = () => this.triggerAdd$.next();
  protected readonly cancel = () => this.matDialogRef.close(false);
}
