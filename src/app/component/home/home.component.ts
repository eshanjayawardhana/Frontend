import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserAuthService } from '../services/api/user/user-auth.service';

interface ServiceOffering {
  icon: string;
  title: string;
  category: string;
  description: string;
  features: string[];
}

interface WorkflowStep {
  stepNumber: string;
  icon: string;
  title: string;
  description: string;
}

interface PestCategory {
  name: string;
  icon: string;
  severity: 'High' | 'Medium' | 'Critical';
  commonSigns: string;
}

interface FaqItem {
  question: string;
  answer: string;
  isOpen?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Navigation state for mobile view
  isMobileNavOpen = false;

  // Dynamically get the current year
  readonly currentYear: number = new Date().getFullYear();

  // Dynamic statistics displayed in the hero section
  readonly heroStats = [
    { value: '99.4%', label: 'Eradication Success' },
    { value: '24/7', label: 'Site Monitoring' },
    { value: '100%', label: 'Eco-Certified Chemicals' },
    { value: '500+', label: 'Protected Industrial Sites' }
  ];

  // Core services aligned with Agrosole Service Types & Specializations
  readonly services: ServiceOffering[] = [
    {
      icon: 'bi-shield-check',
      title: 'Termite Control & Barrier Systems',
      category: 'Structural Protection',
      description: 'Advanced soil treatment and baiting programs designed to protect commercial and residential foundations.',
      features: ['Pre & Post-construction treatments', 'Long-term warranty contracts', 'Non-invasive thermal inspection']
    },
    {
      icon: 'bi-cloud-haze2',
      title: 'Industrial & Warehouse Fumigation',
      category: 'Fumigation',
      description: 'Certified high-penetration fumigation for agricultural storage, factories, shipping containers, and silos.',
      features: ['Export-grade compliance', 'Zero-residue gas aeration', 'Certified fumigation specialists']
    },
    {
      icon: 'bi-building-check',
      title: 'Commercial Site Contracts (AMC)',
      category: 'Preventive Management',
      description: 'Scheduled year-round pest management contracts with digital audit logs and priority emergency dispatch.',
      features: ['Dedicated site technicians', 'Audit-ready digital reports', 'Custom chemical safety tracking']
    },
    {
      icon: 'bi-bug',
      title: 'General Pest & Vector Eradication',
      category: 'General Pest Control',
      description: 'Targeted elimination of rodents, cockroaches, mosquitoes, and crawling insects using eco-friendly formulations.',
      features: ['Odorless gel & spray treatments', 'Child and pet-safe chemicals', 'Root-cause habitat removal']
    }
  ];

  // System workflow matching your project modules (Request -> Inspection -> Contract/Job)
  readonly workflowSteps: WorkflowStep[] = [
    {
      stepNumber: '01',
      icon: 'bi-file-earmark-text',
      title: 'Submit Service Request',
      description: 'Log your pest issue, target site location, and preferred schedule through our digital portal.'
    },
    {
      stepNumber: '02',
      icon: 'bi-clipboard2-pulse',
      title: 'Certified Site Inspection',
      description: 'Our licensed technicians conduct a thorough on-site assessment to measure infestation severity.'
    },
    {
      stepNumber: '03',
      icon: 'bi-clipboard-check',
      title: 'Targeted Treatment Job',
      description: 'Precision treatment execution using approved chemicals, tracked with real-time job completion logs.'
    },
    {
      stepNumber: '04',
      icon: 'bi-file-earmark-check',
      title: 'Ongoing Service Contract',
      description: 'Continuous protection and scheduled preventive visits to ensure pests never return to your facility.'
    }
  ];

  // Target pests showcase
  readonly targetPests: PestCategory[] = [
    {
      name: 'Subterranean Termites',
      icon: 'bi-moisture',
      severity: 'Critical',
      commonSigns: 'Mud tubes on walls, hollow-sounding timber, and discarded wings.'
    },
    {
      name: 'Rodents & Rats',
      icon: 'bi-exclamation-triangle',
      severity: 'High',
      commonSigns: 'Gnawed wiring, droppings near storage areas, and scratching sounds.'
    },
    {
      name: 'Stored Product Insects',
      icon: 'bi-box-seam',
      severity: 'High',
      commonSigns: 'Damaged grain sacks, webbing in raw materials, and live beetles.'
    },
    {
      name: 'Cockroaches & Crawling Pests',
      icon: 'bi-bug-fill',
      severity: 'Medium',
      commonSigns: 'Droppings in dark corners, unpleasant musty odors, and egg casings.'
    }
  ];

  // Interactive FAQ list
  faqs: FaqItem[] = [
    {
      question: 'Are the chemicals used in treatments safe for food-grade warehouses and homes?',
      answer: 'Yes. Every chemical in our inventory is strictly regulated, eco-certified, and applied according to international safety standards by licensed technicians.',
      isOpen: true
    },
    {
      question: 'What is the difference between a One-Time Service Request and a Service Contract?',
      answer: 'A Service Request addresses an immediate, isolated pest problem with a dedicated inspection and treatment job. A Service Contract (AMC) provides continuous, scheduled year-round protection for commercial or residential sites.',
      isOpen: false
    },
    {
      question: 'How quickly can a technician be assigned for an urgent inspection?',
      answer: 'High-priority requests are flagged immediately in our system, allowing us to dispatch a specialized technician (Termite, Fumigation, or General) within 24 hours.',
      isOpen: false
    }
  ];

  constructor(
    private router: Router,
    private userAuthService: UserAuthService
  ) {}

  ngOnInit(): void {}

  // Toggle mobile navigation drawer
  toggleMobileNav(): void {
    this.isMobileNavOpen = !this.isMobileNavOpen;
  }

  // Close mobile navigation drawer
  closeMobileNav(): void {
    this.isMobileNavOpen = false;
  }

  // Check if user already has an active session
  isLoggedIn(): boolean {
    return this.userAuthService.isLoggedIn();
  }

  // Primary call-to-action routing
  navigateToPortal(): void {
    if (this.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Toggle FAQ accordion item
  toggleFaq(index: number): void {
    this.faqs[index].isOpen = !this.faqs[index].isOpen;
  }
}
