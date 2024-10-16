import { CommonModule, Location } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { DonationService, Donor } from '../services/donation.service'
import { ActivatedRoute } from '@angular/router'
import { HeaderComponent } from '../shared/header/header.component'
import { FooterComponent } from '../shared/footer/footer.component'
import { Fundraiser, FundraisersService } from '../services/fundraisers.service'

@Component({
  selector: 'app-donate',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.css',
})
export class DonateComponent implements OnInit {
  constructor(private service: DonationService, private fundraiserService: FundraisersService, private route: ActivatedRoute, private location: Location) {}
  donation: number = 0 // 初始化捐款金额
  donorName: string = '' // 捐赠者姓名
  fundraiserInfo: Fundraiser | null = null
  ngOnInit(): void {
    this.fundraiserService.fetchFundraiserDetails(this.route.snapshot.queryParams['id']).subscribe(res => {
      this.fundraiserInfo = res
    })
  }
  submitDonation() {
    if (this.donation < 5) {
      alert('The minimum donation is AUD 5')
      return
    }
    if (this.donorName === '') return
    const data: Donor = {
      GIVER: this.donorName,
      AMOUNT: this.donation,
      FUNDRAISER_ID: this.route.snapshot.queryParams['id'],
    }
    if (data.FUNDRAISER_ID === null || data.FUNDRAISER_ID === undefined) return alert('Page error, return to try again')
    this.service.addDonor(data).subscribe(res => {
      alert('Thank you for your donation to ' + this.fundraiserInfo?.ORGANIZER)
      this.location.back()
    })
  }
}
