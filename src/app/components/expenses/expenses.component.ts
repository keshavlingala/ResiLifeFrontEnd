import {Component, OnDestroy, OnInit} from '@angular/core';
import {BackendService} from "../../services/backend.service";
import {HttpClient} from "@angular/common/http";
import {Subscription} from "rxjs";
import {SplitwiseExpenseItem, SplitwiseExpenseUser} from "../../misc/types";
import {GoogleChartInterface, GoogleChartType} from "ng2-google-charts";

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit, OnDestroy {
  transactions: SplitwiseExpenseItem[] = [];
  subs: Subscription[] = []
  selectedUser: SplitwiseExpenseUser | null = null
  pieChart: GoogleChartInterface = {
    chartType: GoogleChartType.PieChart,
    dataTable: [
      ['Category', 'Amount'],
      ['Food', 100],
      ['Rent', 200],
      ['Utilities', 300],
    ],
    // firstRowIsData: true,
    options: {
      title: 'Tasks',
      legend: {position: 'bottom'},
    },
  };
  barChart: GoogleChartInterface = {
    chartType: GoogleChartType.BarChart,
    dataTable: [
      ['Category', 'Amount'],
      ['Food', 100],
      ['Rent', 200],
      ['Utilities', 300],
    ],
    // firstRowIsData: true,
    options: {
      title: 'Tasks',
      legend: {position: 'bottom'},
    },
  }

  constructor(
    public backend: BackendService,
    public http: HttpClient
  ) {
    console.log(this)
  }

  get payments() {
    return this.transactions?.filter(expense => expense.payment)
  }

  get expenses() {
    return this.transactions?.filter(expense => !expense.payment)
  }

  ngOnInit() {
    this.subs.push(this.backend.getExpenses().subscribe((data: SplitwiseExpenseItem[]) => {
      this.transactions = data as SplitwiseExpenseItem[]
      console.log(this.expenses)
      let categories = this.expenses.map(exp => exp.category.name)
      categories = [...new Set(categories)]
      let dataTable = [['Category', 'Amount']]
      categories.forEach(category => {
        const amount = this.expenses.filter(exp => exp.category.name === category).reduce((acc, cur) => acc + +cur.cost, 0)
        // @ts-ignore
        dataTable.push([category, amount])
      })
      this.pieChart.dataTable = dataTable
      this.barChart.dataTable = dataTable
      this.pieChart.component?.draw()
      this.barChart.component?.draw()
    }))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
  }

  getUserPic(picture: { small: string; medium: string; large: string }) {
    return picture.large || picture.medium || picture.small
  }

  changeSelected(user: SplitwiseExpenseUser) {
    if (this.selectedUser && this.selectedUser.user.id === user.user.id) {
      this.selectedUser = null
      return
    }
    this.selectedUser = user
  }

  getPayer(exp: SplitwiseExpenseItem) {
    return exp.users.find(user => +user.net_balance > 0)
  }

  getpayee(exp: SplitwiseExpenseItem) {
    return exp.users.find(user => +user.net_balance < 0)
  }
}
