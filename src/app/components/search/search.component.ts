import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  header$ = this.route.params.pipe(
    map((params) => params['search'].toUpperCase())
  );
  constructor(private route: ActivatedRoute) {}
}
