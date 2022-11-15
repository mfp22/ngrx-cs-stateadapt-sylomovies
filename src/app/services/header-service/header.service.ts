import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  searchUrl = environment.searchUrl;
  apiKey = environment.apiKey;
  language = environment.language;
  constructor(private fb: UntypedFormBuilder, private http: HttpClient) {}

  createForm() {
    return this.fb.group({
      search: ['', Validators.required],
    });
  }

  searchMovies(query: { search: string }) {
    return this.http
      .get(
        `${this.searchUrl}${this.apiKey}${this.language}&query=${query.search}`
      )
      .pipe(
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
  }
}
