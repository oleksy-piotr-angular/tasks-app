import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from './services/task.service';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements DoCheck {
  title = 'tasks-app';
  email: string | null = '';
  isMenuRequired: boolean = false;
  constructor(
    private router: Router,
    private notification: NotificationService,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  proceedLogOut() {
    this.taskService.clearTasksList();
    this.authService.logout();
    this.notification.showSuccess(
      'You have successfully logged out',
      'Success:'
    );
    this.router.navigate(['signin']);
  }
  //TODO Check if you Could change something and check URL - there is another possibility
  ngDoCheck(): void {
    let currentURL = this.router.url;
    if (currentURL == '/signin' || currentURL == '/register') {
      this.isMenuRequired = false;
    } else {
      this.email = localStorage.getItem('email');
      this.isMenuRequired = true;
    }
  }
}
