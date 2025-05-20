import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

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
  private router = inject(Router);
  constructor(private http: HttpClient) {}

  createAccount() {
    const user = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password
    };

    this.http.post('http://localhost:8000/users', user)
      .subscribe({
        next: (response) => {
          console.log('User created:', response)
          this.router.navigate(['/login']);
        },
        error: (error) => console.error('Error creating user:', error)
      });
  }
}
