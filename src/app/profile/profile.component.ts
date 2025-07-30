import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { UserPayload } from './user-payload';
import { Location } from '@angular/common'; // ✅ Importe o Location

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  standalone: true
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  resumeFile: File | null = null;
  userId: number | null = null;

  // ✅ Injete o Location no construtor
  constructor(private fb: FormBuilder, private http: HttpClient, private location: Location) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      github: [''],
      linkedin: [''],
      portfolio: [''],
      city: [''],
      state: [''],
      country: [''],
      workPreference: ['Remote', Validators.required],
      interestArea: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  // ✅ Novo método para voltar para a página anterior
  goBack(): void {
    this.location.back();
  }

  // ... (o restante do seu código .ts continua o mesmo) ...

  // Mapeia o valor do formulário para o valor da API
  getWorkPreferenceApiValue = (preference: string): 'remote' | 'on-site' | 'hybrid' | null => {
    const preferenceMap: { [key: string]: 'remote' | 'on-site' | 'hybrid' } = {
      'Remote': 'remote',
      'Onsite': 'on-site',
      'Hybrid': 'hybrid'
    };
    return preferenceMap[preference] || null;
  };

  // Mapeia o valor da API para o valor de exibição no formulário
  getWorkPreferenceDisplayValue = (value: "remote" | "on-site" | "hybrid" | null | undefined): string | null => {
    if (!value) return null;
    const displayMap: { [key: string]: string } = {
      'remote': 'Remote',
      'on-site': 'Onsite',
      'hybrid': 'Hybrid'
    };
    return displayMap[value] || null;
  };

  loadUserData(): void {
    // A requisição para /users/me deve retornar os dados do usuário logado
    this.http.get<UserPayload>(`http://localhost:8000/users/me`)
      .subscribe(user => {
        this.userId = user.user_id;
        this.profileForm.patchValue({
          fullName: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone,
          github: user.github_url,
          linkedin: user.linkedin_url,
          portfolio: user.portfolio_url,
          city: user.city,
          state: user.state,
          country: user.country,
          workPreference: this.getWorkPreferenceDisplayValue(user.work_preference),
          interestArea: user.interest_area,
        })
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.resumeFile = input.files[0];
      // Opcional: mostrar o nome do arquivo no formulário
    }
  }

  saveChanges(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const fullNameParts = this.profileForm.value.fullName.split(' ');
    const firstName = fullNameParts.shift() || '';
    const lastName = fullNameParts.join(' ');


    const userData: UserPayload = {
      // @ts-ignore
      user_id: this.userId,
      first_name: firstName,
      last_name: lastName,
      email: this.profileForm.value.email,
      phone: this.profileForm.value.phone,
      github_url: this.profileForm.value.github,
      linkedin_url: this.profileForm.value.linkedin,
      portfolio_url: this.profileForm.value.portfolio,
      city: this.profileForm.value.city,
      state: this.profileForm.value.state,
      country: this.profileForm.value.country,
      work_preference: this.getWorkPreferenceApiValue(this.profileForm.value.workPreference),
      interest_area: this.profileForm.value.interestArea,
    };
    console.log(this.userId)
    if (this.userId) {
      this.http.put(`http://localhost:8000/users/${this.userId}`, userData)
        .subscribe(response => {
          console.log('User updated:', response);
          if (this.resumeFile) {
            this.uploadResume();
          }
        });
    }
  }

  uploadResume(): void {
    if (!this.resumeFile || !this.userId) return;

    const formData = new FormData();
    formData.append('resume', this.resumeFile, this.resumeFile.name);

    this.http.post(`http://localhost:8000/users/${this.userId}/upload_resume`, formData)
      .subscribe(response => {
        console.log('Resume uploaded:', response);
      });
  }

  deleteAccount(): void {
    if (this.userId && confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      this.http.delete(`http://localhost:8000/users/${this.userId}`)
        .subscribe(response => {
          console.log('Account deleted:', response);
        });
    }
  }
}
