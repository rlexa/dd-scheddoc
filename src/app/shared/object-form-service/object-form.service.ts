import {DestroyRef, inject, Injectable, OnDestroy} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {jsonEqual, rxFanOut} from 'dd-rxjs';
import {BehaviorSubject, combineLatest, distinctUntilChanged, map, startWith, Subject, switchMap} from 'rxjs';

@Injectable()
export class ObjectFormService<T extends object> implements OnDestroy {
  constructor() {
    this.init();
  }

  private readonly destroyRef = inject(DestroyRef);

  private readonly source$ = new BehaviorSubject<T | undefined>(undefined);
  protected readonly model$ = new BehaviorSubject<T | undefined>(undefined);
  private readonly modelValidator$ = new BehaviorSubject<((model: T) => boolean) | undefined>(undefined);

  private readonly resetTrigger = new Subject<void>();

  readonly hasChanges$ = combineLatest([
    this.source$.pipe(distinctUntilChanged(jsonEqual)),
    this.model$.pipe(distinctUntilChanged(jsonEqual)),
  ]).pipe(
    map(([source, value]) => !!source && !!value && !jsonEqual(source, value)),
    distinctUntilChanged(),
    rxFanOut(),
  );

  readonly canReset$ = this.hasChanges$;

  readonly valid$ = this.modelValidator$.pipe(
    switchMap((fnValidate) =>
      this.model$.pipe(
        distinctUntilChanged(jsonEqual),
        map((model) => !!model && (!fnValidate || fnValidate(model))),
        distinctUntilChanged(),
        rxFanOut(),
      ),
    ),
  );

  readonly value$ = this.model$.asObservable();

  ngOnDestroy() {
    this.model$.complete();
    this.modelValidator$.complete();
    this.resetTrigger.complete();
    this.source$.complete();
  }

  private init() {
    this.source$
      .pipe(
        distinctUntilChanged(jsonEqual),
        switchMap((source) =>
          this.resetTrigger.pipe(
            startWith('meh'),
            map(() => source),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((val) => this.model$.next(val));
  }

  readonly reset = () => this.resetTrigger.next();
  readonly setSource = (val: T | undefined) => this.source$.next(val);

  protected readonly addModelValidator = (fn: (model: T) => boolean) => this.modelValidator$.next(fn);
}
