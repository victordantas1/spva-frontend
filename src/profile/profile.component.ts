import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./profile.component.css'],
  standalone: true
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  resumeFile: File | null = null;
  userId = 1; // Supondo ID do usuário logado

  constructor(private fb: FormBuilder, private http: HttpClient) {
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

  loadUserData(): void {
    this.http.get<any>(`http://localhost:8000/users/${this.userId}`)
      .subscribe(user => {
        this.profileForm.patchValue({
          fullName: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone || '',
          github: user.github || '',
          linkedin: user.linkedin || '',
          portfolio: user.portfolio || '',
          city: user.city || '',
          state: user.state || '',
          country: user.country || '',
          workPreference: user.work_preference || 'Remote',
          interestArea: user.interest_area || ''
        });
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.resumeFile = input.files[0];
    }
  }

  saveChanges(): void {
    if (this.profileForm.valid) {
      const fullName = this.profileForm.value.fullName.split(' ');
      const firstName = fullName[0];
      const lastName = fullName.slice(1).join(' ');

      const userData = {
        first_name: firstName,
        last_name: lastName,
        email: this.profileForm.value.email,
        phone: this.profileForm.value.phone,
        github: this.profileForm.value.github,
        linkedin: this.profileForm.value.linkedin,
        portfolio: this.profileForm.value.portfolio,
        city: this.profileForm.value.city,
        state: this.profileForm.value.state,
        country: this.profileForm.value.country,
        work_preference: this.profileForm.value.workPreference,
        interest_area: this.profileForm.value.interestArea,
        password: 'dummy', // required by schema, replace with actual
        role_id: 1, // adjust if needed
        birthdate: '2000-01-01' // dummy date
      };

      this.http.put(`http://localhost:8000/users/${this.userId}`, userData)
        .subscribe(response => {
          console.log('User updated:', response);
          if (this.resumeFile) {
            this.uploadResume();
          }
        });
    } else {
      this.profileForm.markAllAsTouched();
    }
  }

  uploadResume(): void {
    const formData = new FormData();
    if (this.resumeFile) {
      formData.append('resume', this.resumeFile);
      this.http.post(`http://localhost:8000/users/${this.userId}/upload_resume`, formData)
        .subscribe(response => {
          console.log('Resume uploaded:', response);
        });
    }
  }

  deleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action is irreversible.')) {
      this.http.delete(`http://localhost:8000/users/${this.userId}`)
        .subscribe(response => {
          console.log('Account deleted:', response);
          // redirect or logout
        });
    }
  }
}
