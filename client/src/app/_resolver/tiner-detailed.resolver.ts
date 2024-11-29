import { ResolveFn } from '@angular/router';
import { Tiner } from '../_models/tiner';
import { inject } from '@angular/core';
import { TinerService } from '../_services/tiner.service';

export const tinerDetailedResolver: ResolveFn<Tiner | null> = (route, state) => {
  const tinerService = inject(TinerService);

  const username = route.paramMap.get('username');

  if (!username) {
    return null;
  }

  return tinerService.getTiner(username);
};
