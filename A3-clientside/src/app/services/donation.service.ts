import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../environments/environment'
import { Observable } from 'rxjs'

export interface Donor {
  GIVER: string
  AMOUNT: number
  FUNDRAISER_ID: number
}

export interface Donation extends Donor {
  DONATION_ID: number
  DATE: string
}

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  constructor(private service: HttpClient) {}

  addDonor(data: Donor): Observable<{ message: string }> {
    return this.service.post<{ message: string }>(environment.apiUrl + '/donation', data)
  }
}
