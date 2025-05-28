import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  isAuthenticated(): boolean {
    // Exemplo: Verifica se cookie de sessão ou JWT está presente
    return document.cookie.includes('token='); // se não for HttpOnly
    // Ou use chamada ao backend se for HttpOnly
  }

  logout() {
    // remove cookie se possível ou faz logout no backend
    window.location.href = '/login';
  }
}

