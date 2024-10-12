import { CommonModule } from '@angular/common'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router'
import { routes } from 'src/app/app.routes'

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  routes: Route[] = []
  pathTitle: Route['title'] = undefined

  ngOnInit(): void {
    this.routes = routes
    this.pathTitle = this.route.routeConfig?.title
  }

  to(url: Route['path']) {
    this.router.navigate([url])
  }
}
