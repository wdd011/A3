import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { DetailsComponent } from './details/details.component'
import { DonateComponent } from './donate/donate.component'
import { FundraisersComponent } from './fundraisers/fundraisers.component'

export const routes: Routes = [
  {
    path: '',
    title: 'Home',
    component: HomeComponent,
  },
  {
    path: 'details',
    title: 'Details',
    component: DetailsComponent,
    data: {
      menus: true, // 不显示在路由菜单上
    },
  },
  {
    path: 'donate',
    title: 'Donate',
    component: DonateComponent,
    data: {
      menus: true, // 不显示在路由菜单上
    },
  },
  {
    path: 'fundraisers',
    title: 'Fundraisers',
    component: FundraisersComponent,
  },
]
