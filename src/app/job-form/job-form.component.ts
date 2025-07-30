import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';
import { switchMap, of } from 'rxjs';

export interface Job {
  job_id: number;
  title: string;
  position: string;
  description: string;
  company: string;
  location: string;
  category: string;
  responsibilities: string;
  requirements: string;
  level: string;
  contract_type: string;
  schedule: string;
  salary_range: string;
}

export interface UserAppOut {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;

}

export enum CategoryEnum {
  REMOTE = "remote",
  ON_SITE = "on-site",
  HYBRID = "hybrid"
}

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent implements OnInit {
  jobForm: FormGroup;
  isEditMode = false;
  categories = Object.values(CategoryEnum);
  private jobId: string | null = null;

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private location = inject(Location);

  constructor() {
    this.jobForm = this.fb.group({
      title: ['', Validators.required],
      position: ['', Validators.required],
      company: [''],
      location: [''],
      category: [CategoryEnum.REMOTE, Validators.required],
      description: ['', Validators.required],
      responsibilities: [''],
      requirements: [''],
      level: [''],
      contract_type: [''],
      schedule: [''],
      salary_range: ['']
    });
  }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    if (this.jobId) {
      this.isEditMode = true;
      this.loadJobData(this.jobId);
    }
  }

  goBack(): void {
    this.location.back();
  }

  loadJobData(id: string): void {
    this.http.get<Job>(`http://localhost:8000/jobs/${id}`)
      .subscribe(data => this.jobForm.patchValue(data));
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.jobForm.markAllAsTouched();
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Sua sessão expirou. Faça login novamente.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<UserAppOut>('http://localhost:8000/users/me', { headers }).pipe(
      switchMap(currentUser => {
        if (!currentUser || !currentUser.user_id) {
          throw new Error('Não foi possível obter o ID do usuário.');
        }

        const jobData = {
          ...this.jobForm.value,
          user_id: currentUser.user_id
        };

        if (this.isEditMode) {
          return this.http.put(`http://localhost:8000/jobs/${this.jobId}`, jobData, { headers });
        } else {
          return this.http.post('http://localhost:8000/jobs', jobData, { headers });
        }
      })
    ).subscribe({
      next: () => {
        const message = this.isEditMode ? 'Vaga atualizada com sucesso!' : 'Vaga criada com sucesso!';
        alert(message);
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        console.error('Erro ao salvar a vaga:', err);
        alert('Ocorreu um erro ao salvar a vaga. Verifique o console para mais detalhes.');
      }
    });
  }
}
