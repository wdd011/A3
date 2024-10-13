import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../environments/environment'
import { Observable } from 'rxjs'

interface Donor {
  GIVER: string
  AMOUNT: number
}

interface Donation extends Donor {
  DONATION_ID: number
  DATE: string
  FUNDRAISER_ID: number
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
