import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Tiner } from '../_models/tiner';
import { of, tap, map } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root'
})
export class TinerService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  // tiners = signal<Tiner[]>([]);
  paginatedResult = signal<PaginatedResult<Tiner[]> | null>(null);

  getTiners(userParams: UserParams) {
    let params = this.setPaginationHeader(userParams.pageNumber, userParams.pageSize);
    console.log('Params:', params);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.http.get<Tiner[]>(this.baseUrl + 'user', { observe: 'response', params }).subscribe({
    next: response => {
      const paginationHeader = response.headers.get('Pagination');
      if (paginationHeader) {
        const parsedPagination = JSON.parse(paginationHeader);
        console.log('Parsed Pagination:', parsedPagination);
        this.paginatedResult.set({
          items: response.body as Tiner[],
          pagination: parsedPagination
        });
      } else {
        console.error('Pagination header is missing.');
      }
    }});
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
    // const tiner = this.tiners().find(x => x.userName === username);

    // if (tiner !== undefined) return of(tiner);

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
