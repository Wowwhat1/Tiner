import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Tiner } from '../_models/tiner';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class TinerService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  private accountService = inject(AccountService);

  getTiners() {
    return this.http.get<Tiner[]>(this.baseUrl + 'user', this.getHttpOpts());
  }

  getTiner(username: string) {
    return this.http.get<Tiner>(this.baseUrl + 'user/' + username, this.getHttpOpts());
  }

  getHttpOpts() {
    return {
      headers: new HttpHeaders ({
        Authorization: `Bearer ${this.accountService.currentUser()?.token}`
      })
    };
  }
}
