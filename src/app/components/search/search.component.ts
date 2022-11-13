import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AppStore } from 'src/app/store/app.store';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  header!: string;
  constructor(
    private store: AppStore,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.state$.subscribe((res) => {
      if (res.flag) {
        this.initialice();
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  initialice() {
    this.route.params.subscribe((params) => {
      this.header = params['search'];
    });
  }
}
