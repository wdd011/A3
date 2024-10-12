import { Component } from '@angular/core'
import { FooterComponent } from '../shared/footer/footer.component'
import { HeaderComponent } from '../shared/header/header.component'
import { BannerComponent } from '../shared/banner/banner.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, HeaderComponent, BannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  images: string[] = ['assets/img/dog.jpg', 'assets/img/yuhan.jpg', 'assets/img/yang.jpg', 'assets/img/shui.jpg', 'assets/img/dog2.jpg']
  data: any = {}
}
