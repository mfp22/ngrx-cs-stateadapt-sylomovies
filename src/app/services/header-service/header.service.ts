import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';

import { AppStore } from 'src/app/store/app.store';
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

  searchMovies(query: string) {
    return this.http.get(
      `${this.searchUrl}${this.apiKey}${this.language}&query=${query.search}`
    );
  }
  catch(err: any) {
    console.log(err);
  }
}
