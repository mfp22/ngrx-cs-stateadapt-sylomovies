import { Component, Input, SimpleChanges } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navigate',
  template: '',
  imports: [RouterModule],
})
export class NavigateComponent {
  @Input() url: string | null = null;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {
    const urlChange = changes['url'];
    const newUrl = urlChange?.currentValue;
    if (newUrl) {
      this.router.navigate([newUrl]);
    }
  }
}
