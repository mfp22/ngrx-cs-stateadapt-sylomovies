import { Component, Input } from '@angular/core';
import { MovieModel } from 'src/app/models/movie.interface';

@Component({
  selector: 'app-movies-list',
  templateUrl: './movies-list.component.html',
  styleUrls: ['./movies-list.component.scss'],
})
export class MoviesListComponent {
  @Input() movies: MovieModel[] | null = [];
}
