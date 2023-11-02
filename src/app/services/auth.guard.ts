import {CanActivateFn} from '@angular/router';

export const authGuard: CanActivateFn = (route,
                                         state) => {
  if (!localStorage.getItem('token')) {
    window.location.href = '/login';
  }
  return !!localStorage.getItem('token');
};
