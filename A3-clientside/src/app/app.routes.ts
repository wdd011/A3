import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component'
import { DetailsComponent } from './details/details.component'

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
]
