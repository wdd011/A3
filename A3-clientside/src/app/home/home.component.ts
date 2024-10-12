import { Component, OnInit } from '@angular/core'
import { FooterComponent } from '../shared/footer/footer.component'
import { HeaderComponent } from '../shared/header/header.component'
import { BannerComponent } from '../shared/banner/banner.component'
import { Fundraiser, FundraisersService } from '../services/fundraisers.service'
import { CommonModule } from '@angular/common'
import { Route, Router } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, BannerComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private service: FundraisersService, private router: Router) {}
  images: string[] = ['assets/img/dog.jpg', 'assets/img/yuhan.jpg', 'assets/img/yang.jpg', 'assets/img/shui.jpg', 'assets/img/dog2.jpg']
  dataList: Fundraiser[] = []

  ngOnInit(): void {
    this.getFundraisers()
  }

  // 获取筹款活动
  getFundraisers() {
    this.service.fetchFundraisers().subscribe(res => {
      this.dataList = res
    })
  }

  // 跳转
  to(url: Route['path'], id: number) {
    this.router.navigate([url], { queryParams: { id } })
  }
}
