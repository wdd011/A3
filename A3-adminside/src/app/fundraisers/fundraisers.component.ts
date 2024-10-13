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
  isVisible: boolean = false
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
    IMAGES: null,
  }
  modalType: 'new' | 'edit' = 'new'

  categories: Category[] = []
  imageBase64: string = ''

  imagesType: boolean = false

  currentFunding: number = 0

  ngOnInit(): void {
    this.getFundraisers()
    this.getCategories()
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        this.imageBase64 = reader.result as string // 将图像转换为 Base64 编码
        this.imagesType = false
      }
      reader.readAsDataURL(file)
    }
  }

  getFundraisers() {
    this.fundraiserService.search({}).subscribe(res => {
      this.fundraisers = res
    })
  }
  getFundraiserDetails(id: number) {
    this.fundraiserService.fetchFundraiserDetails(id).subscribe(res => {
      this.currentFundraiser = res
      this.imageBase64 = res.IMAGES
      this.currentFunding = res.CURRENT_FUNDING
    })
  }
  getCategories() {
    this.categoryService.fetchCategory().subscribe(res => {
      this.categories = res
    })
  }

  // 打开模态框
  openModal(item?: Fundraiser) {
    this.modalType = item ? 'edit' : 'new'
    this.isVisible = true
    if (this.modalType === 'edit') {
      this.getFundraiserDetails(item!.FUNDRAISER_ID)
    }
  }

  // 关闭模态框
  closeModal() {
    this.isVisible = false
    this.currentFundraiser = {
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
      IMAGES: null,
    }
    this.imagesType = false
    this.imageBase64 = ''
    this.currentFunding = 0
  }

  // 提交表单 编辑
  saveFundraiser(form: any) {
    const formData = JSON.parse(JSON.stringify(form.value))
    formData.images = this.imageBase64
    formData.currentFunding = this.currentFunding
    this.fundraiserService.updateFundraisers(formData).subscribe(res => {
      alert(res.message)
      this.getFundraisers()
      form.reset()
      this.closeModal()
    })
  }

  // 删除
  openDeleteModal(id: number) {
    if (confirm('Are you sure you want to delete this data?')) {
      this.fundraiserService.deleteFundraisers(id).subscribe(res => {
        alert(res.message)
        this.getFundraisers()
      })
    }
  }

  submit(form: any) {
    if (form.valid) {
      if (!this.imageBase64) {
        this.imagesType = true
        return
      }
      if (this.modalType === 'new') {
        this.createFundraiser(form)
      } else {
        this.saveFundraiser(form)
      }
    } else {
      if (!this.imageBase64) {
        this.imagesType = true
      }
      Object.keys(form.controls).forEach(field => {
        const control = form.controls[field]
        if (control.invalid) {
          console.log(`${field} is invalid`)
        }
      })
    }
  }
  // 创建文件
  createFundraiser(form: any) {
    const formData = JSON.parse(JSON.stringify(form.value))
    formData.images = this.imageBase64
    this.fundraiserService.addFundraiser(formData).subscribe(res => {
      alert(res.message)
      form.reset()
      this.closeModal()
      this.getFundraisers()
    })
  }
}
