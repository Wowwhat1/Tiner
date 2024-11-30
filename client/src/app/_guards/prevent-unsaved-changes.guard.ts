import { CanDeactivateFn } from '@angular/router';
import { TinerEditComponent } from '../members/tiner-edit/tiner-edit.component';
import { inject } from '@angular/core';
import { ConfirmService } from '../_services/confirm.service';

export const preventUnsavedChangesGuard: CanDeactivateFn<TinerEditComponent> = (component) => {
  const confirmService = inject(ConfirmService);
  
  if (component.editForm?.dirty) {
    return confirmService.confirm() ?? false;
  }
  return true;
};
