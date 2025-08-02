import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAdmin = true;

  if (isAdmin) {
    return true;
  } else {
    router.navigate(['/jobs']);
    return false;
  }
};
