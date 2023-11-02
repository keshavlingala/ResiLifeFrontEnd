import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  friends: any[] = [];

  constructor(
    public backend: BackendService,
    public http: HttpClient
  ) {
  }

  ngOnInit() {
  }
}
