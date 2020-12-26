import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { DetailComponent } from './component/detail/detail.component';
import { BasketComponent } from './component/basket/basket.component';
import { LoginComponent } from './component/login/login.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { PlaceOrderComponent } from './component/checkout/place-order/place-order.component';
import { RegisterComponent } from './component/register/register.component';
import { OrderConfirmationComponent } from './component/order/order-confirmation/order-confirmation.component';
import { ProfileComponent } from './component/profile/profile.component';
import { AuthGuard } from './helpers/auth-guard';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ProductBrowserComponent } from './component/product-browser/product-browser.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent, canActivate : [AuthGuard]
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
  },
  {
    path: 'order-confirmation', component: OrderConfirmationComponent
  },
  {
    path: 'profile', component: ProfileComponent
  },
  {
    path: 'forgot-password', component: ForgotPasswordComponent
  },
  {
    path: 'reset-password', component: ResetPasswordComponent
  }
  ,
  {
    path: 'category-browser/:id', component: ProductBrowserComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
