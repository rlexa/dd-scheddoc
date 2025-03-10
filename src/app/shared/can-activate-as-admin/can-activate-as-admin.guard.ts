import {inject} from '@angular/core';
import {CanActivateFn, createUrlTreeFromSnapshot} from '@angular/router';
import {map} from 'rxjs';
import {DiIsAdmin} from 'src/app/data';
import {RouteMain} from 'src/routing';

export const canActivateAsAdmin: CanActivateFn = (route) => {
  const isAdmin$ = inject(DiIsAdmin);

  return isAdmin$.pipe(map((ok) => (ok ? true : createUrlTreeFromSnapshot(route, ['/', RouteMain]))));
};
