import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  BehaviorSubject,
  filter,
  Observable,
  of,
  switchAll,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-navigate',
  template: '<ng-container *ngIf="navigate$ | async"></ng-container>',
  imports: [RouterModule, CommonModule],
})
export class NavigateComponent {
  @Input() set to(val: string) {
    this.toInput$.next(val);
  }
  toInput$ = new BehaviorSubject<string>('');

  @Input() set when(val: Observable<any>) {
    this.whenInput$.next(val);
  }
  whenInput$ = new BehaviorSubject<Observable<any>>(of(null));

  when$ = this.whenInput$.pipe(switchAll());
  navigate$ = this.when$.pipe(
    withLatestFrom(this.toInput$),
    filter(([, url]) => url !== ''),
    tap(([, url]) => this.router.navigate([url]))
  );

  constructor(private router: Router) {}
}
