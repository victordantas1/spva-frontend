import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  private router = inject(Router);

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;

      const body = new HttpParams()
        .set('username', formValue.username)
        .set('password', formValue.password);

      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      });

      try {
        const response = await lastValueFrom(
          this.http.post<{ access_token: string; token_type: string }>(
            'http://localhost:8000/auth/login',
            body.toString(),
            { headers }
          )
        );

        document.cookie = `token=${response.access_token}; path=/; max-age=86400`;
        localStorage.setItem('token', response.access_token);
        console.log('Login realizado com sucesso!');
        this.router.navigate(['/jobs']);
      } catch (err) {
        console.error('Erro ao fazer login:', err);
      }
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
