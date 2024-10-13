import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { HeaderComponent } from '../shared/header/header.component'
import { FooterComponent } from '../shared/footer/footer.component'
import { ActivatedRoute, Route, Router } from '@angular/router'
import { Fundraiser, FundraisersService } from '../services/fundraisers.service'

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent implements OnInit {
  constructor(private service: FundraisersService, private router: Router, private route: ActivatedRoute) {}
  images: string[] = ['assets/img/dog.jpg', 'assets/img/yuhan.jpg', 'assets/img/yang.jpg', 'assets/img/shui.jpg', 'assets/img/dog2.jpg']
  detailInfo: Fundraiser | undefined = undefined

  ngOnInit(): void {
    this.getDetailInfo()
  }
  getDetailInfo() {
    this.service.fetchFundraiserDetails(this.route.snapshot.queryParams['id']).subscribe(res => {
      console.log(res)
      this.detailInfo = res
    })
  }
  // 跳转
  to(url: Route['path'], id: number) {
    this.router.navigate([url], { queryParams: { id } })
  }
}
