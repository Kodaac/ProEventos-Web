import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  if(localStorage.getItem('user') !== null){
    return true;
  } else {
    toastr.info('Usuário não autenticado!');
    router.navigate(['/user/login']);
    return false;
  }

};
