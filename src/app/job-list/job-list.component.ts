import {Component, inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent {

  jobs: any[] = [];
  isAdmin = true;

  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

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
  createNewJob(): void {
    this.router.navigate(['/admin/jobs/new']);
  }

  deleteJob(jobId: number, event: Event): void {
    event.stopPropagation();

    if (confirm('Tem certeza que deseja deletar esta vaga?')) {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Sessão expirada.');
        return;
      }

      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      this.http.delete(`http://localhost:8000/jobs/${jobId}`, { headers })
        .subscribe({
          next: () => {
            alert('Vaga deletada com sucesso!');

            this.jobs = this.jobs.filter(job => job.job_id !== jobId);
          },
          error: (err) => {
            console.error('Erro ao deletar vaga:', err);
            alert('Não foi possível deletar a vaga.');
          }
        });
    }
  }

  goToEditJob(jobId: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/admin/jobs/edit', jobId]);
  }

  private getTokenFromCookies(): string | null {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    return match ? match[2] : null;
  }

  goToJobDetails(jobId: number) {
    this.router.navigate(['/job-details', jobId]);
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

  goToApplicants(jobId: number, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/admin/jobs', jobId, 'candidates']);
  }

  logout(): void {
    this.authService.logout();
  }

}
