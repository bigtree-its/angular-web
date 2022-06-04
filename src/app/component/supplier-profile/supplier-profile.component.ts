import { Component, OnInit } from '@angular/core';
import { User, UserSession } from 'src/app/model/common-models';
import { LocalChef, LocalChefSearchQuery } from 'src/app/model/localchef';
import { AccountService } from 'src/app/service/account.service';
import { LocalChefService } from 'src/app/service/localchef.service';

@Component({
  selector: 'app-supplier-profile',
  templateUrl: './supplier-profile.component.html',
  styleUrls: ['./supplier-profile.component.css']
})
export class SupplierProfileComponent implements OnInit {
  userSession: UserSession;
  user: User;
  supplier: LocalChef;

  constructor(private supplierService: LocalChefService,
    private accountService: AccountService
  ) { }

  ngOnInit(): void {
    this.accountService.userSessionSubject$.subscribe(userSession => {
      this.userSession = userSession;
      console.log('UserSession : ' + JSON.stringify(this.userSession));
      if (userSession !== null && userSession.user !== null && userSession.user !== undefined) {
        this.user = this.userSession.user;
        var query: LocalChefSearchQuery = new LocalChefSearchQuery();
        query.email = this.user.email;
        this.supplierService.getAllLocalChefs(query).subscribe(supplier => {
          this.supplier = supplier[0];
          console.log('The supplier: '+ JSON.stringify(this.supplier))
        }, err => { });
      } else {
      }
    })

  }


}
