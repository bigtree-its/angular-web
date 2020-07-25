import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { DetailComponent } from './component/detail/detail.component';
import { BasketComponent } from './component/basket/basket.component';
import { LoginComponent } from './component/login/login.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { PlaceOrderComponent } from './component/checkout/place-order/place-order.component';
import { RegisterComponent } from './component/register/register.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'product/:id', component: DetailComponent
  }
  ,{
    path: 'basket', component: BasketComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'checkout', component: CheckoutComponent
  },
  {
    path: 'review', component: PlaceOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
