import { Component, Input } from '@angular/core';

type StatusTone =
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'neutral';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {

  @Input() status: string | null = null;

  get displayStatus(): string {
    return this.status?.trim() || 'Unknown';
  }

  get statusClass(): string {
    const value = this.displayStatus
      .toLowerCase()
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ');

    const tone = this.getTone(value);

    return `status-badge--${tone}`;
  }

  private getTone(value: string): StatusTone {

    // Successful or completed states
    const successStatuses = [
      'active',
      'completed',
      'complete',
      'paid',
      'closed',
      'resolved'
    ];

    if (successStatuses.includes(value)) {
      return 'success';
    }

    // Information and work-in-progress states
    const infoStatuses = [
      'new',
      'open',
      'scheduled',
      'in progress',
      'processing'
    ];

    if (infoStatuses.includes(value)) {
      return 'info';
    }

    // States that need attention
    const warningStatuses = [
      'pending',
      'urgent',
      'unpaid',
      'low stock',
      'on leave'
    ];

    if (warningStatuses.includes(value)) {
      return 'warning';
    }

    // Unsuccessful, expired or overdue states
    const dangerStatuses = [
      'cancelled',
      'canceled',
      'rejected',
      'failed',
      'inactive',
      'overdue',
      'expired',
      'out of stock'
    ];

    if (dangerStatuses.includes(value)) {
      return 'danger';
    }

    return 'neutral';
  }

}
