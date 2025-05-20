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
    const token = this.getTokenFromCookies();

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // @ts-ignore
    this.http.get<any[]>('http://localhost:8000/jobs', { headers, responseType: 'json' })
      .subscribe({
        next: (data) => {
          // @ts-ignore
          this.jobs = data;
        },
        error: (error) => {
          console.error('Erro ao buscar os jobs:', error);
        }
      });
  }

// Função auxiliar para extrair o token do cookie
  private getTokenFromCookies(): string | null {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    return match ? match[2] : null;
  }

  goToJobDetails(jobId: number) {
    this.router.navigate([`/job-details/${jobId}`]);
  }

  getUserId() {
    return 14;
  }

  goToProfile() {
    const userId = this.getUserId();
    if (userId) {
      this.router.navigate([`/profile/${userId}`]);
    } else {
      console.warn('ID do usuário não encontrado no token.');
    }
  }

}
