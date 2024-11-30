import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const accService = inject(AccountService);
  const roles = accService.roles();
  const toastr = inject(ToastrService);
  
  
  if (accService.roles()?.includes('Admin') || accService.roles()?.includes('Moderator')) {
    return true;
  } else {
    toastr.error('You cannot enter this pages');
    return false;
  }
};
