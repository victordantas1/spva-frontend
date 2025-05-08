import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./job-detail.component.css']
})
export class JobDetailComponent implements OnInit {
  job: any;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('id');
    if (jobId) {
      this.fetchJobDetails(jobId);
    }
  }

  fetchJobDetails(id: string): void {
    this.http.get(`http://localhost:8000/jobs/${id}`).subscribe({
      next: (data) => this.job = data,
      error: (err) => console.error('Erro ao buscar vaga:', err)
    });
  }
}
