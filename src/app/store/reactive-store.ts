import { ComponentStore, Projector, SelectConfig } from '@ngrx/component-store';
import {
  BehaviorSubject,
  merge,
  Observable,
  of,
  share,
  switchAll,
  tap,
  using,
} from 'rxjs';

type Sources<State extends Object, Store extends ComponentStore<State>> = {
  [K in keyof Store]: Store[K] extends (payload: any) => any
    ? Observable<Parameters<Store[K]>[0] | void>
    : any;
};

export class ReactiveStore<State extends Object> extends ComponentStore<State> {
  private sources$$ = new BehaviorSubject<Observable<any>>(of(null));
  private requireSources$ = this.sources$$.pipe(switchAll());

  react<ChildStore extends ComponentStore<State>>(
    store: ChildStore,
    sources: Partial<Sources<State, ChildStore>>
  ) {
    this.sources$$.next(
      merge(
        this.sources$$.getValue(),
        ...Object.keys(sources).map((name) =>
          (sources[name as keyof Sources<State, ChildStore>] as any).pipe(
            tap((store[name as keyof ComponentStore<State>] as any).bind(store))
          )
        )
      ).pipe(share())
    );
  }

  override select<Result>(
    projector: (s: State) => Result,
    config?: SelectConfig
  ): Observable<Result>;
  override select<Selectors extends Observable<unknown>[], Result>(
    ...args: [...selectors: Selectors, projector: Projector<Selectors, Result>]
  ): Observable<Result>;
  override select<Selectors extends Observable<unknown>[], Result>(
    ...args: [
      ...selectors: Selectors,
      projector: Projector<Selectors, Result>,
      config: SelectConfig
    ]
  ): Observable<Result>;
  override select(...args: any[]) {
    return using(
      () => this.requireSources$.subscribe(),
      () => (super.select as any)(...args)
    );
  }
}
