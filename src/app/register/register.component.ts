import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  showPassword = false;
  resumeFile: File | null = null;

  private router = inject(Router);
  private http = inject(HttpClient);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.resumeFile = input.files[0];
    }
  }

  createAccount() {

    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    if (!this.resumeFile) {
      alert('Por favor, anexe seu currículo.');
      return;
    }

    const userPayload = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
      role_id: 1
    };

    this.http.post<{ user_id: number }>('http://localhost:8000/users', userPayload).pipe(
      switchMap(newUser => {
        if (!newUser || !newUser.user_id) {
          throw new Error('Não foi possível obter o ID do novo usuário.');
        }

        const formData = new FormData();
        formData.append('resume', this.resumeFile!, this.resumeFile!.name);

        return this.http.post(`http://localhost:8000/users/${newUser.user_id}/upload_resume`, formData);
      })
    ).subscribe({
      next: () => {
        alert('Conta criada com sucesso e currículo enviado!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Ocorreu um erro no processo de registro:', error);
        alert('Não foi possível criar a conta. Verifique os dados e tente novamente.');
      }
    });
  }
}
