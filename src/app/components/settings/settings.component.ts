import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {BackendService} from "../../services/backend.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  keysGroup = new FormGroup({
    splitwiseApiKey: new FormControl(''),
    canvasApiKey: new FormControl('')
  })
  userInfoGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
  })

  constructor(
    private backendService: BackendService,
  ) {
    this.keysGroup.get('splitwiseApiKey')?.setValue(this.backendService.userData.meta?.splitwiseApiKey || '')
    this.keysGroup.get('canvasApiKey')?.setValue(this.backendService.userData.meta?.canvasApiKey || '')
    this.userInfoGroup.get('firstName')?.setValue(this.backendService.userData.firstName)
    this.userInfoGroup.get('lastName')?.setValue(this.backendService.userData.lastName)
  }

  updateKeys() {
    const {splitwiseApiKey, canvasApiKey} = this.keysGroup.value
    this.backendService.updateKeys(splitwiseApiKey || undefined, canvasApiKey || undefined)
  }

  updateInfo() {
    const {firstName, lastName} = this.userInfoGroup.value
    this.backendService.updateInfo(firstName || undefined, lastName || undefined)
  }
}


//Keys
// Splitwise: n1IVZ3S5O8oVRTKmVebzLbnMaTyUZGESHqPyyHpW
// Canvas : 349~pizbsr6MEHIIGqDJc18NIWubk8lpC3AwOljw7GMCSFxQd0V8PPl0CG9w2eVzJrZ1
