import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, merge, Observable, pairwise, switchMap } from 'rxjs';
import { MovieModel } from 'src/app/models/movie.interface';
import { environment } from 'src/environments/environment';
import { HeaderService } from '../services/header-service/header.service';
import { ReactiveStore } from './reactive-store';

export interface OrderState {
  movies: MovieModel[];
  movieSelected: MovieModel | null;
  search: MovieModel[];
  flag: boolean;
}

@Injectable()
export class AppStore extends ReactiveStore<OrderState> {
  constructor(private router: Router, private headerService: HeaderService) {
    super({
      movies: [],
      movieSelected: null,
      search: [],
      flag: false,
    });

    const urlAfterNav$ = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.url)
    );

    const urlFromMovieDetailToHome$ = urlAfterNav$.pipe(
      pairwise(),
      filter(
        ([before, after]) =>
          before === '/movie' && ['/home', '/'].includes(after)
      )
    );

    const searchRoute$ = urlAfterNav$.pipe(
      filter((url) => url.startsWith('/search'))
    );

    const searchResults$ = searchRoute$.pipe(
      switchMap((url) => {
        const [, search] = url.split('/search/');
        return this.headerService.searchMovies({ search });
      }),
      map((res: any) =>
        res.results.map((movie: any) => ({
          ...movie,
          poster_path:
            movie.poster_path !== null
              ? `${environment.imageUrl}${movie.poster_path}`
              : 'assets/no-image.png',
        }))
      )
    );

    this.react<AppStore>(this, {
      deleteMovies: merge(urlFromMovieDetailToHome$, searchRoute$).pipe(
        map(() => undefined)
      ),
      saveSearch: searchResults$,
      switchFlag: merge(
        urlFromMovieDetailToHome$.pipe(map(() => false)),
        searchRoute$.pipe(map(() => true))
      ),
    });
  }
  saveMovies = this.updater((state: OrderState, movies: MovieModel[]) => ({
    ...state,
    movies: [...movies, ...state.movies],
  }));

  switchFlag = this.updater((state: OrderState, flag: boolean) => ({
    ...state,
    flag: flag,
  }));

  saveSearch = this.updater((state: OrderState, search: MovieModel[]) => ({
    ...state,
    search: [...search, ...state.search],
  }));

  deleteMovies = this.updater((state: OrderState) => {
    let searchCopy = [...state.search];
    searchCopy.splice(0, searchCopy.length);
    return {
      ...state,
      search: searchCopy,
    };
  });

  saveMovieSelected = this.updater((state: OrderState, movie: MovieModel) => ({
    ...state,
    movieSelected: movie,
  }));
  flag$ = this.select((state) => state.flag);
  movies$: Observable<MovieModel[]> = this.select((state) => state.movies);
  movieSelected$: Observable<MovieModel | null> = this.select(
    (state) => state.movieSelected
  );
}
