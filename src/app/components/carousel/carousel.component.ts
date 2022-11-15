import { Component, inject } from '@angular/core';
import { NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { adapt } from '@state-adapt/angular';
import { buildAdapter } from '@state-adapt/core';
import { booleanAdapter } from '@state-adapt/core/adapters';
import { toSource } from '@state-adapt/rxjs';
import { filter, Subject } from 'rxjs';
import { CarouselServiceService } from 'src/app/services/carousel-service/carousel-service.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent {
  config = {
    interval: 3000,
    unpauseOnArrow: false,
    pauseOnIndicator: false,
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  movies$ = inject(CarouselServiceService).getNowPlaying();

  pausedAdapter = buildAdapter<boolean>()(booleanAdapter)({
    interval: (s) => (s.state ? 9999999 : this.config.interval),
  })(() => ({}))();

  slideChange$ = new Subject<NgbSlideEvent>();
  arrow$ = this.slideChange$.pipe(
    filter(
      (event) =>
        this.config.unpauseOnArrow &&
        (event.source === NgbSlideEventSource.ARROW_LEFT ||
          event.source === NgbSlideEventSource.ARROW_RIGHT)
    ),
    toSource('carousel.paused arrow$')
  );
  indicator$ = this.slideChange$.pipe(
    filter(
      (event) =>
        this.config.pauseOnIndicator &&
        event.source === NgbSlideEventSource.INDICATOR
    ),
    toSource('carousel.paused indicator$')
  );

  paused = adapt(['carousel.paused', false, this.pausedAdapter], {
    setFalse: this.arrow$,
    setTrue: this.indicator$,
  });
}
