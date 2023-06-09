import { Component } from '@angular/core';
import { Router, Event, NavigationError, NavigationEnd } from '@angular/router';
import { TaskService } from './services/task.service';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Welcome in Demo Tasks App';
  email: string | null = '';
  expirationTime: string = '';
  isMenuRequired: boolean = false;
  constructor(
    private router: Router,
    private notification: NotificationService,
    private taskService: TaskService,
    private authService: AuthService
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const currentURL = this.router.url;
        if (currentURL == '/signin' || currentURL == '/register') {
          this.isMenuRequired = false;
        } else {
          this.email = this.authService.getEmail;
          this.expirationTime = this.authService.getSessionTime;
          this.isMenuRequired = true;
        }
      }
      if (event instanceof NavigationError) {
        router.navigate(['signin']);
        notification.showError(event.error, 'Error: ');
      }
    });
  }

  proceedLogOut() {
    this.taskService.clearTasksList();
    this.authService.signOut();
    this.notification.showSuccess(
      'You have successfully logged out',
      'Success:'
    );
    this.router.navigate(['signin']);
  }
}
