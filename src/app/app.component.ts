import { Component, DoCheck } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from './services/task.service';
import { AuthService } from './services/auth.service';

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
    private toastr: ToastrService,
    private taskService: TaskService,
    private authService: AuthService
  ) {}

  proceedLogOut() {
    this.taskService.clearTasksList();
    this.authService.logout();
    // localStorage.removeItem('email');
    // localStorage.removeItem('user_auth');
    this.toastr.clear();
    this.toastr.success('You have successfully logged out');
    this.router.navigate(['signin']);
  }
  ngDoCheck(): void {
    let currentURL = this.router.url;
    if (currentURL == '/signin' || currentURL == '/register') {
      this.isMenuRequired = false;
    } else {
      this.email = localStorage.getItem('email');
      this.isMenuRequired = true;
    }
  }
  isLoading(): boolean {
    return localStorage.hasOwnProperty('isLoading');
  }
}
