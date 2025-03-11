import {InjectionToken} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export const DiSelectedDate = new InjectionToken<BehaviorSubject<string | null>>('Selected date.', {
  providedIn: 'root',
  factory: () => new BehaviorSubject<string | null>(null),
});
