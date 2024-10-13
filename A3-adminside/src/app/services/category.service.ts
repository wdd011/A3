import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

export interface Category {
  CATEGORY_ID: number
  NAME: string
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private service: HttpClient) {}
  apiUrl: string = 'https://24275060.it.scu.edu.au'

  fetchCategory(): Observable<Category[]> {
    return this.service.get<Category[]>(this.apiUrl + '/categories')
  }
}
