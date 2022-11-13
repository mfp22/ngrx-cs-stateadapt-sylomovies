import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SwalParams } from 'sweetalert/typings/core';
import swal from 'sweetalert';

@Component({
  standalone: true,
  selector: 'app-swal',
  template: '',
})
export class SwalComponent {
  @Input() show: boolean | null = false;
  @Input() options: SwalParams[0] = {};
  @Output() close = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges) {
    const showChange = changes['show'];
    const newShow = showChange?.currentValue;
    if (newShow) {
      swal(this.options).then((value) => this.close.emit(value));
    }
  }
}
