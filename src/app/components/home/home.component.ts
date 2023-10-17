import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    public backendService: BackendService,
    public router: Router
  ) {
  }

  ngOnInit() {
    if (!this.backendService.groupData.payload.memberDetails) {
      this.backendService.getMemberDetails()
    }
  }

  getDummyPic(email: string, size: number) {
    return 'https://picsum.photos/seed/' + encodeURIComponent(email) + '/' + size
  }

  route(path: string) {
    console.log('routing to ' + path)
    this.router.navigate([path])
  }
}
