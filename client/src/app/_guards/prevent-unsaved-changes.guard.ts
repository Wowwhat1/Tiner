import { CanDeactivateFn } from '@angular/router';
import { TinerEditComponent } from '../members/tiner-edit/tiner-edit.component';

export const preventUnsavedChangesGuard: CanDeactivateFn<TinerEditComponent> = (component) => {
  if (component.editForm?.dirty) {
    return confirm('Unsaved changes will be lost, please save your changes before leaving.');
  }
  return true;
};
