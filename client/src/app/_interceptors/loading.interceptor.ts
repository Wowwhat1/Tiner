import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../_services/busy.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const bisyService = inject(BusyService);

  bisyService.busy();

  return next(req).pipe(
    delay(1000),
    finalize(() => {
      bisyService.idle();
    }
  ));
};
