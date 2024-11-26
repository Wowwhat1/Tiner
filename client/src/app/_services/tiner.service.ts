import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Tiner } from '../_models/tiner';

@Injectable({
  providedIn: 'root'
})
export class TinerService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;

  getTiners() {
    return this.http.get<Tiner[]>(this.baseUrl + 'user');
  }

  getTiner(username: string) {
    return this.http.get<Tiner>(this.baseUrl + 'user/' + username);
  }

  updateTiner(tiner: Tiner) {
    return this.http.put(this.baseUrl + 'user', tiner);
  }
}
