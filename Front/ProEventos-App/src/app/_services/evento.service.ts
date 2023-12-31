import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { Evento } from '../_models/Evento';
import { environment } from '@environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  baseUrl = environment.apiURL +"api/eventos";

  [key: string]: any;

  constructor(private http: HttpClient) { }

  public getEventos(): Observable<Evento[]>{
    return this.http.get<Evento[]>(this.baseUrl).pipe(take(1));  //.pipe(take(1)) usado para dar unsubscribe após o uso  
  }

  public getElementosByTema(tema: string): Observable<Evento[]>{
    return this.http.get<Evento[]>(`${this.baseUrl}/tema/${tema}`).pipe(take(1));
  }

  public getEventoById(id: number): Observable<Evento>{
    return this.http.get<Evento>(`${this.baseUrl}/${id}`).pipe(take(1));
  }

  public post(evento: Evento): Observable<Evento>{
    return this.http.post<Evento>(this.baseUrl, evento).pipe(take(1));
  }

  public put(evento: Evento): Observable<Evento>{
    return this.http.put<Evento>(`${this.baseUrl}/${evento.id}`, evento).pipe(take(1));
  }

  public deleteEvento(id: number): Observable<any>{
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(take(1));
  }  

  public postUpload(eventoId: number, file: File): Observable<Evento>{
    const fileToUpload = file[0] as File;
    const formData = new FormData();

    formData.append('File', fileToUpload);

    return this.http.post<Evento>(`${this.baseUrl}/upload-image/${eventoId}`, formData).pipe(take(1));
  }

}
