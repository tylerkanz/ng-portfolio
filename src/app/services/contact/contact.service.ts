import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = '/api/contact';

  constructor(private http: HttpClient) {}

  submitMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    website?: string;
    turnstileToken?: string;
  }): Observable<any> {
    return this.http.post<any>(this.apiUrl, { data });
  }
}
