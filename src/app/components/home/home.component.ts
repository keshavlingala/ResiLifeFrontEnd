import {Component} from '@angular/core';
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private backendService: BackendService,
  ) {
    backendService.fetchUserData()
      .subscribe((data) => {
        console.log(data);
      })
  }
}
