
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

    return `status-badge--${this.getTone(value)}`;
  }

  private getTone(value: string): StatusTone {

    // Pest severity levels
    if (value === 'low') {
      return 'success';
    }

    if (value === 'medium') {
      return 'warning';
    }

    if (value === 'high' || value === 'critical' || value === 'severe') {
      return 'danger';
    }

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
