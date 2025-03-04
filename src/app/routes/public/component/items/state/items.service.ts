import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../../../environments/environment";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { AnnouncementDto, AnnouncementRequest, AnnouncementResponse } from "./item.model";
import { tap } from "rxjs/operators";


@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getItems(): Observable<AnnouncementDto[]> {
    return this.http.get<AnnouncementDto[]>(`${this.apiUrl}/announcements`);
  }

  getAnnouncements(request: AnnouncementRequest): Observable<AnnouncementResponse> {
    const params = new HttpParams()
      .set('localisation', request.localisation || '')
      .set('category', request.category || '')
      .set('search', request.search || '')
      .set('page', request.page || 1)
      .set('size', request.size || 10);

    return this.http.get<AnnouncementResponse>(
      `${this.apiUrl}/announcements`,
      { 
        params,
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      }
    ).pipe(
      tap(response => console.log('Response:', response))
    );
  }
  

}


