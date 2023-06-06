import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notification = inject(NotificationService);
  if (authService.isLoggedIn) {
    return true;
  } else {
    notification.showInfo(
      'If you want to check App, please Sign in...',
      'NFO:'
    );
    router.navigate(['signin']);
    console.log('If you want to check App, please Sign in...');
    return false;
  }
};
