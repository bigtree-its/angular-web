import {Component, TemplateRef} from '@angular/core';
import { AppToastService } from 'src/app/service/AppToastService';


@Component({
  selector: 'app-app-toast',
  templateUrl: './app-toast.component.html',
  styleUrls: ['./app-toast.component.css']
})
export class AppToastComponent {

  constructor(public toastService: AppToastService) { }
  
  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }

}
