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
    router.navigate(['signin']);
    console.log('authGuard: not logged In');
    return false;
  }
};
