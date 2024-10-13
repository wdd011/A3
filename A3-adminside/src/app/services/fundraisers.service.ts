import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
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
  IMAGES: string //图片
}

export interface FormFundraiser {
  FUNDRAISER_ID: number | null
  ORGANIZER: string | null
  CAPTION: string | null
  TARGET_FUNDING: number | null
  CURRENT_FUNDING: number | null
  CITY: string | null
  ACTIVE: number | null
  CATEGORY_ID: number | null
  INTRO: string | null
  CATEGORY_NAME: string | null
  IMAGES: null | string
}

@Injectable({
  providedIn: 'root',
})
export class FundraisersService {
  constructor(private service: HttpClient) {}
  apiUrl: string = 'http://localhost:3002'

  // 获取筹款活动
  fetchFundraisers(): Observable<Fundraiser[]> {
    return this.service.get<Fundraiser[]>(this.apiUrl + '/fundraisers')
  }
  // 新增筹款活动
  addFundraiser(form: FormFundraiser) {
    return this.service.post<{ message: string }>(this.apiUrl + '/fundraisers', form)
  }

  // 获取筹款活动详情
  fetchFundraiserDetails(id: number): Observable<Fundraiser> {
    return this.service.get<Fundraiser>(this.apiUrl + '/fundraiser/' + id)
  }

  // 搜索筹款活动
  search(data: Partial<Fundraiser>): Observable<Fundraiser[]> {
    return this.service.get<Fundraiser[]>(this.apiUrl + '/search', { params: data })
  }

  // 删除
  deleteFundraisers(id: number): Observable<{ message: string }> {
    return this.service.delete<{ message: string }>(this.apiUrl + '/fundraisers/' + id)
  }

  // 更新
  updateFundraisers(data: any): Observable<{ message: string }> {
    return this.service.put<{ message: string }>(this.apiUrl + '/fundraisers/' + data.fundraiserId, data)
  }
}
