import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '../environments/environment'
import { Observable } from 'rxjs'
export interface Fundraiser {
  FUNDRAISER_ID: number // 筹款人 ID
  ORGANIZER: string // 组织者名称
  CAPTION: string // 标题
  TARGET_FUNDING: number // 目标资金
  CURRENT_FUNDING: number // 当前资金
  CITY: string // 城市
  ACTIVE: number // 是否激活
  CATEGORY_ID: number // 类别 ID
  INTRO: string // 描述
  CATEGORY_NAME: string // 类别名称
}

@Injectable({
  providedIn: 'root',
})
export class FundraisersService {
  constructor(private service: HttpClient) {}

  // 获取筹款活动
  fetchFundraisers(): Observable<Fundraiser[]> {
    return this.service.get<Fundraiser[]>(environment.apiUrl + '/fundraisers')
  }

  // 获取筹款活动详情
  fetchFundraiserDetails(id: number): Observable<Fundraiser> {
    return this.service.get<Fundraiser>(environment.apiUrl + '/fundraiser/' + id)
  }

  // 搜索筹款活动
  search(data: Partial<Fundraiser>): Observable<Fundraiser[]> {
    return this.service.get<Fundraiser[]>(environment.apiUrl + '/search', { params: data })
  }
}
