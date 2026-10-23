import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {

  // Page title
  @Input() title: string = '';

  // Short description displayed below the title
  @Input() description: string = '';

  // Optional action button text
  // Leave empty to hide the button
  @Input() actionLabel: string = '';

  // Bootstrap Icons class for the action button
  @Input() actionIcon: string = 'bi-plus-lg';

  // Notify the parent component when the button is clicked
  @Output() actionClicked = new EventEmitter<void>();

}
