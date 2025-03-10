import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {combineLatest, distinctUntilChanged, map} from 'rxjs';
import {DiDbUser, DiSelectedUser} from 'src/app/data';
import {DiSelectedUserId} from 'src/app/data/active';
import {DbUserGroup, DbUserQualification, qualificationsGerman} from 'src/app/data/db';
import {RouteParamUserId} from 'src/routing';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule],
})
export class UserComponent implements OnDestroy, OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly id$ = inject(DiSelectedUserId);
  protected readonly user$ = inject(DiSelectedUser);
  protected readonly self$ = inject(DiDbUser);

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
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((user) => this.formGroup.setValue({group: user?.group ?? null, qualification: user?.qualification ?? null}));
  }
}
