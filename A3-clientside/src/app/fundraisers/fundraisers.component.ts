import { Component, OnInit } from '@angular/core'
import { HeaderComponent } from '../shared/header/header.component'
import { FooterComponent } from '../shared/footer/footer.component'
import { Route, Router } from '@angular/router'
import { Fundraiser, FundraisersService } from '../services/fundraisers.service'
import { CommonModule } from '@angular/common'
import { FormsModule, NgForm } from '@angular/forms'
import { Category, CategoryService } from '../services/category.service'

interface searchFundraiser {
  ORGANIZER: null | string
  CAPTION: null | string
  TARGET_FUNDING: null | number
  CURRENT_FUNDING: null | number
  CITY: null | string
  ACTIVE: null | number
  CATEGORY_ID: null | number
}

@Component({
  selector: 'app-fundraisers',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule],
  templateUrl: './fundraisers.component.html',
  styleUrl: './fundraisers.component.css',
})
export class FundraisersComponent implements OnInit {
  constructor(private service: FundraisersService, private categoryService: CategoryService, private router: Router) {}
  images: string[] = ['assets/img/dog.jpg', 'assets/img/yuhan.jpg', 'assets/img/yang.jpg', 'assets/img/shui.jpg', 'assets/img/dog2.jpg']
  categories: Category[] = []
  dataList: Fundraiser[] = []
  searchType: number = 0

  searchData: searchFundraiser = {
    ORGANIZER: null,
    CAPTION: null,
    TARGET_FUNDING: null,
    CURRENT_FUNDING: null,
    CITY: null,
    ACTIVE: null,
    CATEGORY_ID: null,
  }

  ngOnInit(): void {
    this.getCategory()
  }

  // 跳转
  to(url: Route['path'], id: number) {
    this.router.navigate([url], { queryParams: { id } })
  }

  // 获取所有分类
  getCategory() {
    this.categoryService.fetchCategory().subscribe(res => {
      this.categories = res
    })
  }
  // 搜索
  search() {
    if (this.isObjectEmpty(this.searchData)) {
      return alert('You need to enter at least one parameter!')
    }
    this.service.search(this.searchData as Partial<Fundraiser>).subscribe(res => {
      if (res.length === 0) {
        this.toggleSearchType(1)
      } else {
        this.toggleSearchType(2)
        this.dataList = res
      }
    })
  }
  // 清空表单
  clearChechboxes(form: NgForm) {
    form.resetForm()
    this.toggleSearchType(0)
  }
  // 切换搜索状态 ( 0:还未搜索，1没有查询到任何内容，2搜索列表 )
  toggleSearchType(type: number = 0) {
    this.searchType = type
  }

  // 判断对象是否全部为空
  isObjectEmpty(data: any): boolean {
    return Object.values(data).every(value => value === null || value === undefined || value === '')
  }
}
