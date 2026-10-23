import { Component, Input } from '@angular/core';

export type StatCardAccent = 'green' | 'gold' | 'blue' | 'sage';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {

  @Input() label: string = '';

  @Input() value: string | number = '—';

  @Input() description: string = '';

  @Input() iconClass: string = 'bi bi-bar-chart';

  @Input() accent: StatCardAccent = 'green';

}
