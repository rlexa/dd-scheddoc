import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar} from '@angular/material/snack-bar';
import {combineLatest, distinctUntilChanged, map} from 'rxjs';
import {DiDbCalendar, DiDbUser} from 'src/app/data';
import {DiSelectedDate} from 'src/app/data/active';
import {DbUserAvailability} from 'src/app/data/db';
import {fanOut, strPadStartWithZero2, strPadStartWithZero4} from 'src/util';
import {CalendarFormService} from './calendar-form.service';
import {MonthComponent} from './month';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, MatButtonModule, MatButtonToggleModule, MatIconModule, MonthComponent],
  providers: [CalendarFormService],
})
export class CalendarComponent implements OnInit, OnDestroy {
  private readonly dbCalendar$ = inject(DiDbCalendar);
  private readonly dbUser$ = inject(DiDbUser);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly formService = inject(CalendarFormService);
  protected readonly matSnackBar = inject(MatSnackBar);
  protected readonly selectedDate$ = inject(DiSelectedDate);

  protected readonly id$ = this.dbUser$.pipe(
    map((ii) => ii?.id ?? null),
    distinctUntilChanged(),
    fanOut(),
  );

  protected readonly formValue$ = this.formService.value$;
  protected readonly canReset$ = this.formService.canReset$;

  protected readonly canSave$ = combineLatest([this.formService.hasChanges$, this.formService.valid$]).pipe(
    map(([hasChanges, valid]) => hasChanges && valid),
    distinctUntilChanged(),
  );

  protected dates: string[] = [];

  ngOnDestroy() {
    this.selectedDate$.next(null);
  }

  ngOnInit() {
    this.dbCalendar$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((ii) => this.formService.setSource(ii));

    const now = new Date();
    const next0 = new Date(now);
    next0.setMonth(now.getMonth() + 1);
    const next1 = new Date(now);
    next1.setMonth(now.getMonth() + 2);
    const next2 = new Date(now);
    next2.setMonth(now.getMonth() + 3);

    this.dates = [now, next0, next1, next2].map(
      (ii) => `${strPadStartWithZero4(ii.getFullYear().toString())}-${strPadStartWithZero2((ii.getMonth() + 1).toString())}T00:00:00.000`,
    );
    this.selectedDate$.next(this.dates[1]);
  }

  protected readonly reset = () => this.formService.reset();
  protected readonly save = () => this.matSnackBar.open('TODO save TODO', 'OK');

  protected readonly setAvailability = (user: string, date: string, value: DbUserAvailability | null) =>
    this.formService.setAvailability(user, date, value);

  protected readonly setSelectedDate = (val: string) => this.selectedDate$.next(val);
}
