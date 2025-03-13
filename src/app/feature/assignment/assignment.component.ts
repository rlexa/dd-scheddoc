import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {DiSelectedDate} from 'src/app/data/active';
import {ToMonthDaysPipe} from 'src/app/shared/to-month-days';
import {generateCurrentMonths} from 'src/util-date';
import {MonthAssignmentComponent} from './month-assignment';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatSnackBarModule,
    MonthAssignmentComponent,
    ToMonthDaysPipe,
  ],
})
export class AssignmentComponent implements OnInit, OnDestroy {
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly matSnackBar = inject(MatSnackBar);
  protected readonly selectedDate$ = inject(DiSelectedDate);

  protected dates: string[] = [];

  ngOnDestroy() {
    this.selectedDate$.next(null);
  }

  ngOnInit() {
    this.dates = generateCurrentMonths();
    this.selectedDate$.next(this.dates[1]);
  }

  protected readonly setSelectedDate = (val: string) => this.selectedDate$.next(val);
}
