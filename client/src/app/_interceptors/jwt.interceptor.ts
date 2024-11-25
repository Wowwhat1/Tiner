import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AccountService } from '../_services/account.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const accService = inject(AccountService);

  if (accService.currentUser()) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accService.currentUser()?.token}`
      }
    });
  }

  return next(req);
};
