import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const accService = inject(AccountService);
  const toastr = inject(ToastrService);

  if (accService.currentUser()) {
    return true;
  } else {
    toastr.error('You have to login first');
    return false;
  }
};
