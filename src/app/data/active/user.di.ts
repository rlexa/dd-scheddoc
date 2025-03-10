import {InjectionToken} from '@angular/core';
import {User} from '@angular/fire/auth';
import {BehaviorSubject} from 'rxjs';

export const DiUser = new InjectionToken<BehaviorSubject<User | undefined | null>>('Current user.', {
  providedIn: 'root',
  factory: () => new BehaviorSubject<User | undefined | null>(undefined),
});
