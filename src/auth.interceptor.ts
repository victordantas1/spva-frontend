import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('token');

  // Clona a requisição para adicionar o cabeçalho de autorização
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Passa a requisição (original ou clonada) para o próximo handler
  return next(authReq).pipe(
    catchError((error: any) => {
      // Verifica se o erro é uma resposta HTTP
      if (error instanceof HttpErrorResponse) {
        // Se o status for 401 (Não Autorizado), o token provavelmente expirou
        if (error.status === 401) {
          console.log('Token expirado ou inválido. Fazendo logout...');
          authService.logout();
        }
      }
      // Propaga o erro para que outros possam tratá-lo se necessário
      return throwError(() => error);
    })
  );
};
