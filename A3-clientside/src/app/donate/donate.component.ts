import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.css',
})
export class DonateComponent {
  donation: number = 0.0 // 初始化捐款金额
  donorName: string = '' // 捐赠者姓名
  submitDonation() {
    if (this.donation < 5) {
      alert('The minimum donation is AUD 5')
      return
    }
    if (this.donorName === '') return
    console.log('Donation Amount:', this.donation.toFixed(2))
    console.log('Donor Name:', this.donorName)
    alert('Thank you for your donation to [fundraiser_name]')
  }
}
