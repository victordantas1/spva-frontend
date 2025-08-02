import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';

export interface Applicant {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  application_date: string;
  resume_path: string;
  score?: number;
}

export interface RecommendationResponse {
  candidate: Applicant;
  score: number;
}

export interface Job {
  title: string;
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
  selector: 'app-job-applicants',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-applicants.component.html',
  styleUrls: ['./job-applicants.component.css']
})
export class JobApplicantsComponent implements OnInit {
  applicants: Applicant[] = [];
  job: Job | null = null;
  jobId: string | null = null;
  isLoading = true;
  isRecommending = false;
  recommendationsLoaded = false;

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private location = inject(Location);

  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    if (this.jobId) {
      this.fetchJobDetails();
      this.fetchApplicants();
    }
  }

  fetchJobDetails(): void {
    this.http.get<Job>(`http://localhost:8000/jobs/${this.jobId}`)
      .subscribe(jobData => this.job = jobData);
  }

  fetchApplicants(): void {
    this.http.get<Applicant[]>(`http://localhost:8000/jobs/${this.jobId}/candidates`)
      .subscribe(data => {
        this.applicants = data;
        this.isLoading = false;
      });
  }

  getRecommendations(): void {
    if (!this.jobId || this.applicants.length === 0) {
      return;
    }

    this.isRecommending = true;
    const candidateIds = this.applicants.map(c => c.user_id);
    const topK = this.applicants.length;

    let params = new HttpParams()
      .set('top_k', topK)
      .appendAll({'candidates': candidateIds});

    this.http.get<RecommendationResponse[]>(`http://localhost:8001/recommendation/${this.jobId}`, { params })
      .subscribe({
        next: (recommendations) => {
          const scoreMap = new Map<number, number>();
          recommendations.forEach(rec => {
            scoreMap.set(rec.candidate.user_id, rec.score);
          });

          this.applicants.forEach(applicant => {
            applicant.score = scoreMap.get(applicant.user_id);
          });

          this.applicants.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

          this.isRecommending = false;
          this.recommendationsLoaded = true;
        },
        error: (err) => {
          console.error('Erro ao buscar recomendações:', err);
          alert('Não foi possível obter as recomendações.');
          this.isRecommending = false;
        }
      });
  }

  goBack(): void {
    this.location.back();
  }
}
