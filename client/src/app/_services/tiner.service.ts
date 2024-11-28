import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Tiner } from '../_models/tiner';
import { of, tap, map } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class TinerService {
  private http = inject(HttpClient);
  private accService = inject(AccountService);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Tiner[]> | null>(null);
  tinerCache = new Map(); 
  user = this.accService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user));

  resetUserParams() {
    this.userParams.set(new UserParams(this.user));
  }

  getTiners() {
    const response = this.tinerCache.get(Object.values(this.userParams()).join('-'));

    if (response) {
      return this.setPaginatedResponse(response);
    }

    let params = this.setPaginationHeader(this.userParams().pageNumber, this.userParams().pageSize);

    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    return this.http.get<Tiner[]>(this.baseUrl + 'user', { observe: 'response', params }).subscribe({
    next: response => {
      this.setPaginatedResponse(response);
      this.tinerCache.set(Object.values(this.userParams()).join('-'), response);
    }});
  }

  private setPaginatedResponse(response: HttpResponse<Tiner[]>) {
    this.paginatedResult.set({
      items: response.body as Tiner[],
      pagination: JSON.parse(response.headers.get('Pagination')!)
    })
  }
  
  private setPaginationHeader(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    return params;
  }

  getTiner(username: string) {
    const tiner : Tiner = [...this.tinerCache.values()].reduce((arr, elem) => arr.concat(elem.body), [])
      .find((t: Tiner) => t.userName === username);

    if (tiner) {
      return of(tiner);
    }

    return this.http.get<Tiner>(this.baseUrl + 'user/' + username);
  }

  updateTiner(tiner: Tiner) {
    return this.http.put(this.baseUrl + 'user', tiner).pipe(
      // tap(() => { 
      //   this.tiners.update(tiners => tiners.map(t => t.userName === tiner.userName ? tiner : t))
      // })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'user/set-main-photo/' + photoId, {});
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(this.baseUrl + 'user/delete-photo/' + photo.id).pipe(
      // tap(() => {
      //   this.tiners.update(tiners => tiners.map(t => {
      //     if(t.photos) {
      //       t.photos = t.photos.filter(p => p.id !== photo.id);
      //     }
      //     return t;
      //   }))
      // })
    );
  }
}
