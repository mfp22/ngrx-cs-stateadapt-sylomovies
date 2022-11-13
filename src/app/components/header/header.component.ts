import { Component } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert';

import { HeaderService } from 'src/app/services/header-service/header.service';
import { filter, map, Subject } from 'rxjs';
import { booleanAdapter } from '@state-adapt/core/adapters';
import { toSource } from '@state-adapt/rxjs';
import { adapt } from '@state-adapt/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  form = this.headerService.createForm();
  constructor(private headerService: HeaderService) {}

  search$ = new Subject<[boolean, string]>();

  searchIsInvalid$ = this.search$.pipe(
    map(([valid]) => !valid),
    toSource('searchIsInvalid$')
  );
  invalidAlertOpen = adapt(
    ['invalidAlertOpen', false, booleanAdapter],
    this.searchIsInvalid$
  );

  url$ = this.search$.pipe(
    filter(([valid]) => valid),
    map(([, search]) => `search/${search}`)
  );
}
