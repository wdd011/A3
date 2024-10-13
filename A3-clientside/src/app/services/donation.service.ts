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
  dateStr: string
}

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  constructor(private service: HttpClient) {}

  addDonor(data: Donor): Observable<{ message: string }> {
    return this.service.post<{ message: string }>(environment.apiUrl + '/donation', data)
  }

  // 根据fundraisers id 获取信息
  fetchDonations(id: number): Observable<Donation[]> {
    return this.service.get<Donation[]>(environment.apiUrl + '/donations', { params: { id } })
  }
}
