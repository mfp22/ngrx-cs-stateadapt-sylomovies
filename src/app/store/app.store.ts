import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map, Observable, pairwise, tap } from 'rxjs';
import { MovieModel } from 'src/app/models/movie.interface';
import { ReactiveStore } from './reactive-store';

export interface OrderState {
  movies: MovieModel[];
  movieSelected: MovieModel | null;
  search: MovieModel[];
  flag: boolean;
  header: string;
}

@Injectable()
export class AppStore extends ReactiveStore<OrderState> {
  constructor(private router: Router) {
    super({
      movies: [],
      movieSelected: null,
      search: [],
      flag: false,
      header: '',
    });

    const urlFromMovieDetailToHome$ = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      pairwise(),
      filter(
        ([before, after]) =>
          before.url === '/movie' && ['/home', '/'].includes(after.url)
      )
    );

    this.react<AppStore>(this, {
      deleteMovies: urlFromMovieDetailToHome$.pipe(map(() => undefined)),
      switchFlag: urlFromMovieDetailToHome$.pipe(map(() => false)),
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

  saveSearchHeader = this.updater((state: OrderState, header: string) => ({
    ...state,
    header: header,
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
  header$ = this.select((state) => state.header);
  movies$: Observable<MovieModel[]> = this.select((state) => state.movies);
  movieSelected$: Observable<MovieModel | null> = this.select(
    (state) => state.movieSelected
  );
}
