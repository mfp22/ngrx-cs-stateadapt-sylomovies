import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbCarousel,
  NgbSlideEvent,
  NgbSlideEventSource,
} from '@ng-bootstrap/ng-bootstrap';
import { MovieModel } from 'src/app/models/movie.interface';

import { CarouselServiceService } from 'src/app/services/carousel-service/carousel-service.service';
import { AppStore } from 'src/app/store/app.store';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  movies: MovieModel[] = [];
  paused = false;
  readonly unpauseOnArrow = false;
  readonly pauseOnIndicator = false;
  readonly pauseOnHover = true;
  readonly pauseOnFocus = true;
  readonly imageUrl = environment.imageUrl;

  @ViewChild('carousel', { static: true }) carousel!: NgbCarousel;
  constructor(
    private router: Router,
    private carouselService: CarouselServiceService,
    private store: AppStore
  ) {}

  ngOnInit(): void {
    this.store.state$.subscribe((res) => {
      if (res.movies.length > 0) {
        this.movies = res.movies;
      } else {
        this.carouselInit();
      }
    });
  }

  carouselInit() {
    this.carouselService.getNowPlaying().subscribe((data) => {
      this.movies = data.results;
      this.movies.map((element: any) => {
        element.poster_path = `${this.imageUrl}${element.poster_path}`;
      });
      this.store.saveMovies(this.movies);
    });
  }
  catch(err: any) {
    console.log(err);
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  onSlide(slideEvent: NgbSlideEvent) {
    if (
      this.unpauseOnArrow &&
      slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT ||
        slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)
    ) {
      this.togglePaused();
    }
    if (
      this.pauseOnIndicator &&
      !slideEvent.paused &&
      slideEvent.source === NgbSlideEventSource.INDICATOR
    ) {
      this.togglePaused();
    }
  }

  openMovieDetails(index: number) {
    this.store.saveMovieSelected(this.movies[index]);
    this.router.navigate(['/movie']);
  }
}
