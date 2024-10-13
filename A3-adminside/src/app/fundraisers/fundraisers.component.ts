import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { FormFundraiser, Fundraiser, FundraisersService } from '../services/fundraisers.service'
import { Category, CategoryService } from '../services/category.service'

@Component({
  selector: 'app-fundraisers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fundraisers.component.html',
  styleUrl: './fundraisers.component.css',
})
export class FundraisersComponent implements OnInit {
  constructor(private fundraiserService: FundraisersService, private categoryService: CategoryService) {}
  // 模态框状态
  isVisible: boolean = true
  fundraisers: Fundraiser[] = []
  // 当前编辑的筹款活动
  currentFundraiser: FormFundraiser = {
    FUNDRAISER_ID: null,
    ORGANIZER: null,
    CAPTION: null,
    TARGET_FUNDING: null,
    CURRENT_FUNDING: null,
    CITY: null,
    ACTIVE: 1,
    CATEGORY_ID: null,
    INTRO: null,
    CATEGORY_NAME: null,
  }

  //
  categories: Category[] = []

  ngOnInit(): void {
    this.getFundraisers()
    this.getCategories()
  }

  getFundraisers() {
    this.fundraiserService.search({}).subscribe(res => {
      this.fundraisers = res
    })
  }
  getCategories() {
    this.categoryService.fetchCategory().subscribe(res => {
      this.categories = res
    })
  }

  // 打开模态框
  openModal(item?: Fundraiser) {
    console.log('name')
    this.isVisible = true
  }

  // 关闭模态框
  closeModal() {
    this.isVisible = false
  }

  // 提交表单
  saveFundraiser(form: HTMLFormElement) {
    const formData = new FormData(form)
    // 处理保存逻辑，例如 API 调用
    console.log('Saving fundraiser...', formData)
    this.closeModal() // 关闭模态框
  }

  // 删除
  openDeleteModal(id: number) {
    if (confirm('Are you sure you want to delete this data?')) {
      this.fundraiserService.deleteFundraisers(id).subscribe(res => {
        alert(res.message)
      })
    }
  }

  submit(form: any) {
    if (form.valid) {
      console.log('Form Submitted!', form.value)
      this.createFundraiser(form.value)
    } else {
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field]
        if (control.invalid) {
          console.log(`${field} is invalid`)
        }
      })
    }
  }
  // 创建文件
  createFundraiser(form: FormFundraiser) {
    this.fundraiserService.addFundraiser(form).subscribe(res => {
      alert(res.message)
      this.closeModal()
    })
  }
}
