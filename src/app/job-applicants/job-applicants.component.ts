import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, Location } from '@angular/common';

export interface Applicant {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  application_date: string;
  resume_path: string;
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

  goBack(): void {
    this.location.back();
  }
}
