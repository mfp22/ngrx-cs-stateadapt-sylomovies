import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, switchMap } from 'rxjs';

import { SingleMovieService } from 'src/app/services/single-movie/single-movie.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-info-movie',
  templateUrl: './info-movie.component.html',
  styleUrls: ['./info-movie.component.scss'],
})
export class InfoMovieComponent {
  singleMovieService = inject(SingleMovieService);
  route = inject(ActivatedRoute);

  movie$ = this.route.params.pipe(
    switchMap(({ id }) => this.singleMovieService.getMovieDetails(+id)),
    filter((movie) => movie != null),
    map((data: any) => ({
      ...data,
      poster_path: `${environment.imageUrl}${data.poster_path}`,
    }))
  );

  cast$ = this.movie$.pipe(
    switchMap((movie) =>
      this.singleMovieService.getCast(movie.id).pipe(
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
}
