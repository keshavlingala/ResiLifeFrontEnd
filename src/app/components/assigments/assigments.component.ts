import {Component} from '@angular/core';
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-assigments',
  templateUrl: './assigments.component.html',
  styleUrls: ['./assigments.component.scss']
})
export class AssigmentsComponent {

  constructor(
    public backend: BackendService
  ) {
  }
}
