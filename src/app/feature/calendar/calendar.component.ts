import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {distinctUntilChanged, map} from 'rxjs';
import {DiDbUser} from 'src/app/data';
import {fanOut, strPadStartWithZero2, strPadStartWithZero4} from 'src/util';
import {MonthComponent} from './month';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, MatButtonToggleModule, MonthComponent],
})
export class CalendarComponent implements OnInit {
  private readonly dbUser$ = inject(DiDbUser);

  protected readonly id$ = this.dbUser$.pipe(
    map((ii) => ii?.id ?? null),
    distinctUntilChanged(),
    fanOut(),
  );

  protected dates: string[] = [];
  protected selectedDate?: string;

  ngOnInit() {
    const now = new Date();
    const last = new Date(now);
    last.setMonth(now.getMonth() - 1);
    const next0 = new Date(now);
    next0.setMonth(now.getMonth() + 1);
    const next1 = new Date(now);
    next1.setMonth(now.getMonth() + 2);
    const next2 = new Date(now);
    next2.setMonth(now.getMonth() + 3);

    this.dates = [last, now, next0, next1, next2].map(
      (ii) => `${strPadStartWithZero4(ii.getFullYear().toString())}-${strPadStartWithZero2((ii.getMonth() + 1).toString())}T00:00:00.000`,
    );
    this.selectedDate = this.dates[2];
  }
}
