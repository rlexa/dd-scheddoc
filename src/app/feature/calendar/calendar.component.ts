import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {distinctUntilChanged, map} from 'rxjs';
import {DiDbUser} from 'src/app/data';
import {fanOut} from 'src/util';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class CalendarComponent {
  private readonly dbUser$ = inject(DiDbUser);

  protected readonly id$ = this.dbUser$.pipe(
    map((ii) => ii?.id ?? null),
    distinctUntilChanged(),
    fanOut(),
  );
}
