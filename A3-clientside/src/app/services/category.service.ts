import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { environment } from '../environments/environment'

export interface Category {
  CATEGORY_ID: number
  NAME: string
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private service: HttpClient) {}

  fetchCategory(): Observable<Category[]> {
    return this.service.get<Category[]>(environment.apiUrl + '/categories')
  }
}
