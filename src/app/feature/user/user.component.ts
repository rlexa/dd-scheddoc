import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, inject, Input, OnDestroy} from '@angular/core';
import {DiSelectedUser} from 'src/app/data';
import {DiSelectedUserId} from 'src/app/data/active';
import {RouteParamUserId} from 'src/routing';

@Component({
  selector: 'app-user',
  template: `<pre>{{ user$ | async | json }}</pre>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class UserComponent implements OnDestroy {
  private readonly id$ = inject(DiSelectedUserId);
  protected readonly user$ = inject(DiSelectedUser);

  @Input({alias: RouteParamUserId}) set id(val: string | null | undefined) {
    this.id$.next(val ?? null);
  }

  ngOnDestroy() {
    this.id$.next(null);
  }
}
