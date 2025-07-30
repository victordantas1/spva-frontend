import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// ✅ Interface 'Job' atualizada com todos os atributos do novo template
export interface Job {
  id: number;
  position: string;
  location: string;
  company: string;
  description: string;
  responsibilities: string;
  requirements: string;
  level: string;
  contractType: string;
  schedule: string;
  salaryRange: string;
}

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      // A requisição GET agora espera o novo formato do objeto Job
      this.http.get<Job>(`http://localhost:8000/jobs/${jobId}`)
        .subscribe(data => {
          this.job = data;
        });
    }
  }

  applyToJob(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token');

    if (!jobId || !token) {
      alert('Você precisa estar logado para se candidatar a uma vaga.');
      return;
    }

    const applicationData = {
      job_id: Number(jobId)
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost:8000/user_jobs', applicationData, { headers })
      .subscribe({
        next: (response) => {
          alert('Sua candidatura foi enviada com sucesso!');
        },
        error: (err) => {
          if (err.status === 400 && err.error.detail === 'You have already applied for this job') {
            alert('Você já se candidatou para esta vaga.');
          } else {
            alert('Ocorreu um erro ao enviar sua candidatura. Tente novamente.');
          }
        }
      });
  }
}
