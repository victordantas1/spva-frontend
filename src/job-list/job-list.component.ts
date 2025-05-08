import {Component, inject} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-job-list',
  imports: [],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent {

  jobs: any[] = [];

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor() {
    this.fetchJobs();
  }

  fetchJobs() {
    this.http.get<any[]>('http://localhost:8000/jobs')
      .subscribe({
        next: (data) => {
          this.jobs = data;
        },
        error: (error) => {
          console.error('Erro ao buscar os jobs:', error);
        }
      });
  }

  goToJobDetails(jobId: number) {
    this.router.navigate([`/job-details/${jobId}`]);
  }

}
