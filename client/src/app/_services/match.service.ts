import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Tiner } from '../_models/tiner';
import { PaginatedResult } from '../_models/pagination';
import { setPaginatedResponse, setPaginationHeader } from './_helper/paginationHelper';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  matchIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Tiner[]> | null>(null);

  toggleMatch(targetId: number) {
    return this.http.post(`${this.baseUrl}match/${targetId}`, {});
  }

  getMatches(predicate: string, pageNumber: number, pageSize: number) {
    let params = setPaginationHeader(pageNumber, pageSize);

    params = params.append('pre', predicate);

    return this.http.get<Tiner[]>(`${this.baseUrl}match`, { observe: 'response', params }).subscribe({
      next: response => setPaginatedResponse(response, this.paginatedResult)
    });
  }

  getMatchIds() {
    return this.http.get<number[]>(`${this.baseUrl}match/list`).subscribe({
      next: ids => {
        this.matchIds.set(ids);
      }
    });
  }
}
