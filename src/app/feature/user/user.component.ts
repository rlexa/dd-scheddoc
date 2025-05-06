import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {collection, deleteDoc, doc, Firestore, getDocs, query, updateDoc, where, writeBatch} from '@angular/fire/firestore';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {notNullUndefined} from 'dd-rxjs';
import {combineLatest, distinctUntilChanged, exhaustMap, filter, map, startWith, Subject, switchMap} from 'rxjs';
import {DiDbUser, DiSelectedUser} from 'src/app/data';
import {DiSelectedUserId} from 'src/app/data/active';
import {
  collectionCalendar,
  collectionUser,
  DbCalendarKey,
  DbUser,
  DbUserGroup,
  DbUserQualification,
  qualificationsGerman,
} from 'src/app/data/db';
import {ConfirmService} from 'src/app/shared/confirm';
import {RouteParamUserId} from 'src/routing';
import {msSecond} from 'src/util-date';

const keyCalendarUser: DbCalendarKey = 'user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatSelectModule, MatSnackBarModule, ReactiveFormsModule],
})
export class UserComponent implements OnDestroy, OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly confirmService = inject(ConfirmService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly firestore = inject(Firestore);
  private readonly id$ = inject(DiSelectedUserId);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  protected readonly self$ = inject(DiDbUser);
  protected readonly user$ = inject(DiSelectedUser);

  private readonly remove$ = new Subject<DbUser>();
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
    this.remove$.complete();
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
                return true;
              } catch (err) {
                console.log('Failed to update user', id, err);
                this.matSnackBar.open('Benutzer nicht gespeichert!', 'OK', {politeness: 'assertive'});
              }
              return false;
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

    this.remove$
      .pipe(
        exhaustMap((user) =>
          this.confirmService.confirm$().pipe(
            switchMap(async (confirmed) => {
              if (!confirmed) {
                return false;
              }

              const refCalendar = collection(this.firestore, collectionCalendar);
              try {
                return await getDocs(query(refCalendar, where(keyCalendarUser, '==', user.id)));
              } catch (err) {
                console.error('Failed to query calendar.', err);
                this.matSnackBar.open('Konnte Benutzer Kalendar nicht lesen.', 'OK', {politeness: 'assertive'});
              }
              return false;
            }),
            switchMap(async (response) => {
              if (!response || typeof response === 'boolean') {
                return response;
              }
              if (response.empty) {
                return true;
              }

              const batch = writeBatch(this.firestore);
              response.forEach((item) => batch.delete(item.ref));

              try {
                await batch.commit();
                return true;
              } catch (err) {
                console.error('Failed to delete calendar.', err);
                this.matSnackBar.open('Konnte Benutzer Kalendar nicht löschen.', 'OK', {politeness: 'assertive'});
              }

              return false;
            }),
            switchMap(async (calendarRemoved) => {
              if (!calendarRemoved) {
                return false;
              }

              const refDoc = doc(this.firestore, collectionUser, user.id!);
              try {
                await deleteDoc(refDoc);
                return true;
              } catch (err) {
                console.error('Failed to delete user.', err);
                this.matSnackBar.open('Konnte Benutzer nicht löschen.', 'OK', {politeness: 'assertive'});
              }

              return false;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((removed) => {
        if (removed) {
          this.matSnackBar.open('Benutzer entfernt.', 'OK', {duration: 2 * msSecond});
          this.router.navigate(['..'], {relativeTo: this.activatedRoute});
        }
      });
  }

  protected readonly reset = () => this.reset$.next();
  protected readonly save = () => this.save$.next();
  protected readonly remove = (val: DbUser) => this.remove$.next(val);
}
