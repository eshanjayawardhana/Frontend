import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

import { StatCardAccent } from '../stat-card/stat-card.component';
import { CustomerSiteService } from '../services/api/customer-site/customer-site.service';
import { CustomerService } from '../services/api/customer/customer.service';
import { ServiceRequestService } from '../services/api/service-request/service-request.service';
import { TechnicianService } from '../services/api/technician/technician.service';



interface DashboardStat {
  label: string;
  value: string | number;
  description: string;
  iconClass: string;
  accent: StatCardAccent;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isLoading = false;
  loadError = false;

  readonly summaryCards: DashboardStat[] = [
    {
      label: 'Total Customers',
      value: '—',
      description: 'Registered customer records',
      iconClass: 'bi bi-people',
      accent: 'green',
    },
    {
      label: 'Customer Sites',
      value: '—',
      description: 'Registered service locations',
      iconClass: 'bi bi-geo-alt',
      accent: 'blue',
    },
    {
      label: 'Technicians',
      value: '—',
      description: 'Registered field technicians',
      iconClass: 'bi bi-person-gear',
      accent: 'sage',
    },
    {
      label: 'Open Requests',
      value: '—',
      description: 'Requests awaiting action',
      iconClass: 'bi bi-clipboard-check',
      accent: 'gold',
    },
  ];

  constructor(
    private customerService: CustomerService,
    private customerSiteService: CustomerSiteService,
    private technicianService: TechnicianService,
    private serviceRequestService: ServiceRequestService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardStatistics();
  }

  loadDashboardStatistics(): void {
    this.isLoading = true;
    this.loadError = false;

    forkJoin({
      customers: this.customerService.GetAllCustomers().pipe(
        catchError((error) => {
          console.error('Failed to load customers:', error);
          return of(null);
        }),
      ),

      customerSites: this.customerSiteService.GetAllCustomerSites().pipe(
        catchError((error) => {
          console.error('Failed to load customer sites:', error);
          return of(null);
        }),
      ),

      technicians: this.technicianService.GetAllTechnicians().pipe(
        catchError((error) => {
          console.error('Failed to load technicians:', error);
          return of(null);
        }),
      ),

      serviceRequests: this.serviceRequestService.GetAllServiceRequests().pipe(
        catchError((error) => {
          console.error('Failed to load service requests:', error);
          return of(null);
        }),
      ),
    })
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (result) => {
          const customers = this.extractRecords(result.customers);
          const customerSites = this.extractRecords(result.customerSites);
          const technicians = this.extractRecords(result.technicians);
          const serviceRequests = this.extractRecords(result.serviceRequests);

          this.summaryCards[0].value =
            result.customers === null ? '—' : customers.length;

          this.summaryCards[1].value =
            result.customerSites === null ? '—' : customerSites.length;

          this.summaryCards[2].value =
            result.technicians === null ? '—' : technicians.length;

          this.summaryCards[3].value =
            result.serviceRequests === null
              ? '—'
              : serviceRequests.filter((request) =>
                  this.isOpenRequest(request),
                ).length;

          this.loadError = Object.values(result).some(
            (response) => response === null,
          );
        },

        error: (error) => {
          // Safety fallback for an unexpected dashboard error.
          console.error('Failed to load dashboard statistics:', error);
          this.loadError = true;
        },
      });
  }

  private extractRecords(response: any): any[] {
    // Supports the response structure used by the existing modules.
    const dataList = response?.data?.dataList;

    if (Array.isArray(dataList)) {
      return dataList;
    }

    // Fallbacks in case an endpoint returns a plain array or another wrapper.
    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.content)) {
      return response.data.content;
    }

    if (Array.isArray(response?.content)) {
      return response.content;
    }

    return [];
  }

  private isOpenRequest(request: any): boolean {
    const statusValue =
      request?.status?.name ??
      request?.statusName ??
      (typeof request?.status === 'string' ? request.status : '');

    const status = String(statusValue).trim().toLowerCase();

    // A request without a readable status is not counted as open.
    if (!status) {
      return false;
    }

    const closedStatuses = [
      'completed',
      'complete',
      'closed',
      'cancelled',
      'canceled',
      'rejected',
      'resolved',
    ];

    return !closedStatuses.some((closedStatus) =>
      status.includes(closedStatus),
    );
  }
}
