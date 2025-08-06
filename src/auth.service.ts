import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    this.router.navigate(['/login']);
  }

  private getDecodedToken(): any {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Erro ao decodificar o token:', e);
      return null;
    }
  }

  private getScopes(): string[] {
    const decodedToken = this.getDecodedToken();
    return decodedToken ? decodedToken.scopes || [] : [];
  }

  public hasScope(requiredScope: string): boolean {
    const scopes = this.getScopes();
    return scopes.includes(requiredScope);
  }

  public isAdmin(): boolean {
    const scopes = this.getScopes();
    return scopes.includes('admin') || scopes.includes('master');
  }
}
