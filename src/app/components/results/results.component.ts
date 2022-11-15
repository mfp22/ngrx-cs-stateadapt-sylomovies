import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { HeaderService } from 'src/app/services/header-service/header.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss'],
})
export class ResultsComponent {
  route = inject(ActivatedRoute);
  headerService = inject(HeaderService);

  movies$ = this.route.params.pipe(
    switchMap(({ search }) => this.headerService.searchMovies({ search }))
  );
}
