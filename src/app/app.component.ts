import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from './component/services/api/user/user-auth.service';
import { UserService } from './component/services/api/user/user.service';
import { ToastService } from './component/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Agrosole | Smart Pest Control System';

  // Sidebar UI state only — existing business logic is unchanged.
  isSidebarCollapsed = false;
  isMobileMenuOpen = false;

  // Update this list when adding, removing or regrouping sidebar links.
  // Keep navigation configuration here instead of duplicating markup in the template.
  readonly navigationGroups = [
    {
      label: 'Core',
      items: [
        { label: 'Dashboard', icon: 'bi-grid-1x2', route: '/dashboard' }
      ]
    },
    {
      label: 'Management',
      items: [
        { label: 'Technicians', icon: 'bi-wrench', route: '/technician' },
        { label: 'Customers', icon: 'bi-people', route: '/customer' },
        { label: 'Customer Sites', icon: 'bi-geo-alt', route: '/customer-site' },
        { label: 'Chemicals', icon: 'bi-droplet', route: '/chemical' },
        { label: 'Notifications', icon: 'bi-bell', route: '/notification' },
        { label: 'Service Requests', icon: 'bi-file-earmark-text', route: '/service-request' },
        { label: 'Inspection', icon: 'bi-clipboard2-pulse', route: '/inspection' },
        { label: 'Treatment Job', icon: 'bi-clipboard-check', route: '/treatment-job' },
      ]
    },
    {
      label: 'Master Data',
      items: [
        { label: 'Pest Types', icon: 'bi-bug', route: '/pest-type' },
        { label: 'Service Types', icon: 'bi-ui-checks-grid', route: '/service-type' }
      ]
    },
    {
      label: 'Administration',
      items: [
        { label: 'Privileges', icon: 'bi-shield-lock', route: '/privilege' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private userAuthService: UserAuthService,
    private userService: UserService,
    public toastService: ToastService
  ) { }

  // Desktop sidebar: collapse / expand.
  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  // Mobile sidebar: open / close.
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  // Close mobile navigation after selecting a menu item.
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  get displayName(): string {
    const user = this.userAuthService.getUser();

    if (!user) {
      return '';
    }

    return `${user.firstName || ''} ${user.lastName || ''}`.trim()
      || user.login
      || `User #${user.id}`;
  }

  get userId(): number | null {
    return this.userAuthService.getUserId();
  }

  isLoggedIn(): boolean {
    return this.userAuthService.isLoggedIn();
  }

  logOut(): void {
    if (this.userAuthService.isLoggedIn()) {
      this.userService.logout().subscribe({
        next: () => {
          this.toastService.info('Signed out');
          this.router.navigate(['/login']);
        },
        error: () => {
          this.userAuthService.clear();
          this.toastService.info('Signed out');
          this.router.navigate(['/login']);
        }
      });

      return;
    }

    this.userAuthService.clear();
    this.toastService.info('Signed out');
    this.router.navigate(['/login']);
  }
}
