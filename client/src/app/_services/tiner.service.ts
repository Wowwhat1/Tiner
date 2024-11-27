import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Tiner } from '../_models/tiner';
import { of, tap, map } from 'rxjs';
import { Photo } from '../_models/photo';

@Injectable({
  providedIn: 'root'
})
export class TinerService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  tiners = signal<Tiner[]>([]);

  getTiners() {
    return this.http.get<Tiner[]>(this.baseUrl + 'user').subscribe({
      next: (tinners: Tiner[]) => {
        this.tiners.set(tinners);
      }
    });
  }

  getTiner(username: string) {
    const tiner = this.tiners().find(x => x.userName === username);

    if (tiner !== undefined) return of(tiner);

    return this.http.get<Tiner>(this.baseUrl + 'user/' + username);
  }

  updateTiner(tiner: Tiner) {
    return this.http.put(this.baseUrl + 'user', tiner).pipe(
      tap(() => { 
        this.tiners.update(tiners => tiners.map(t => t.userName === tiner.userName ? tiner : t))
      })
    );
  }

  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'user/set-main-photo/' + photoId, {});
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(this.baseUrl + 'user/delete-photo/' + photo.id).pipe(
      tap(() => {
        this.tiners.update(tiners => tiners.map(t => {
          if(t.photos) {
            t.photos = t.photos.filter(p => p.id !== photo.id);
          }
          return t;
        }))
      })
    );
  }
}
