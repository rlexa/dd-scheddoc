import {InjectionToken} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export const DiSelectedUserId = new InjectionToken<BehaviorSubject<string | null>>('Selected user ID.', {
  providedIn: 'root',
  factory: () => new BehaviorSubject<string | null>(null),
});
