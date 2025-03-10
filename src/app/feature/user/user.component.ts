import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {doc, Firestore, updateDoc} from '@angular/fire/firestore';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {combineLatest, distinctUntilChanged, filter, map, of, startWith, Subject, switchMap} from 'rxjs';
import {DiDbUser, DiSelectedUser} from 'src/app/data';
import {DiSelectedUserId} from 'src/app/data/active';
import {collectionUser, DbUserGroup, DbUserQualification, qualificationsGerman} from 'src/app/data/db';
import {RouteParamUserId} from 'src/routing';
import {notNullUndefined} from 'src/util';
import {msSecond} from 'src/util-date';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSelectModule, MatSnackBarModule, ReactiveFormsModule],
})
export class UserComponent implements OnDestroy, OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly firestore = inject(Firestore);
  private readonly id$ = inject(DiSelectedUserId);
  private readonly matSnackBar = inject(MatSnackBar);
  protected readonly self$ = inject(DiDbUser);
  protected readonly user$ = inject(DiSelectedUser);

  private readonly reset$ = new Subject<void>();
  private readonly save$ = new Subject<void>();

  @Input({alias: RouteParamUserId}) set id(val: string | null | undefined) {
    this.id$.next(val ?? null);
  }

  protected readonly formGroup = new FormGroup({
    group: new FormControl<DbUserGroup | null>(null, [Validators.required]),
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
    this.id$.next(null);
    this.reset$.complete();
    this.save$.complete();
  }

  ngOnInit() {
    combineLatest([this.self$, this.user$])
      .pipe(
        map(([self, user]) => !!(self?.id === user?.id)),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((isSelf) => (isSelf ? this.formGroup.controls.group.disable() : this.formGroup.controls.group.enable()));

    this.user$
      .pipe(
        switchMap((user) =>
          this.reset$.pipe(
            startWith('meh'),
            map(() => user),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((user) => this.formGroup.setValue({group: user?.group ?? null, qualification: user?.qualification ?? null}));

    combineLatest([this.id$.pipe(filter(notNullUndefined)), this.formGroup.valueChanges])
      .pipe(
        switchMap(([id, value]) =>
          this.save$.pipe(
            switchMap(async () => {
              const ref = doc(this.firestore, collectionUser, id);
              try {
                await updateDoc(ref, value);
                return of(true);
              } catch (err) {
                console.log('Failed to update user', id, err);
                this.matSnackBar.open('Benutzer nicht gespeichert!', 'OK', {politeness: 'assertive'});
              }
              return of(false);
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((ok) => {
        if (ok) {
          this.matSnackBar.open('Benutzer gespeichert', 'OK', {duration: 2 * msSecond});
        }
      });
  }

  protected readonly reset = () => this.reset$.next();
  protected readonly save = () => this.save$.next();
}
