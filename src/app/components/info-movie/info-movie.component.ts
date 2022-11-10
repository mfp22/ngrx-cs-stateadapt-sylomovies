import { Component } from '@angular/core';
import { filter, map, Observable, switchMap } from 'rxjs';

import { MovieModel } from 'src/app/models/movie.interface';
import { SingleMovieService } from 'src/app/services/single-movie/single-movie.service';
import { AppStore } from 'src/app/store/app.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-info-movie',
  templateUrl: './info-movie.component.html',
  styleUrls: ['./info-movie.component.scss'],
})
export class InfoMovieComponent {
  movieSelectedNull$ = this.store.movieSelected$.pipe(
    filter((movie) => movie == null)
  );
  movieNotNull$ = this.store.movieSelected$.pipe(
    filter((movie) => movie != null)
  ) as Observable<MovieModel>;

  movie$ = this.movieNotNull$.pipe(
    switchMap((movie) => this.singleMovie.getMovieDetails(movie.id)),
    map((data: any) => ({
      ...data,
      poster_path: `${environment.imageUrl}${data.poster_path}`,
    }))
  );

  cast$ = this.movie$.pipe(
    switchMap((movie) =>
      this.singleMovie.getCast(movie.id).pipe(
        map((data: any) =>
          (Array.from(data.cast) as any[])
            .filter((c) => c.profile_path != null)
            .map((c) => ({
              ...c,
              profile_path: `${environment.imageUrl}${c.profile_path}`,
            }))
        )
      )
    )
  );

  constructor(
    private store: AppStore,
    private singleMovie: SingleMovieService
  ) {}
}
