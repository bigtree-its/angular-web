import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { DetailComponent } from './component/detail/detail.component';
import { BasketComponent } from './component/basket/basket.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { OrderConfirmationComponent } from './component/order/order-confirmation/order-confirmation.component';
import { ProfileComponent } from './component/profile/profile.component';
import { AuthGuard } from './helpers/auth-guard';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ProductBrowserComponent } from './component/product-browser/product-browser.component';
import { CollectDeliveryAddressComponent } from './component/checkout/collect-delivery-address/collect-delivery-address.component';
import { CollectPaymentComponent } from './component/checkout/collect-payment/collect-payment.component';
import { ProductFinderComponent } from './component/product-finder/product-finder.component';
import { PropertiesComponent } from './component/properties/properties.component';
import { PropertyDetailComponent } from './component/properties/property-detail/property-detail.component';


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
    path: 'delivery-address', component: CollectDeliveryAddressComponent, canActivate : [AuthGuard]
  },
  {
    path: 'collect-payment', component: CollectPaymentComponent, canActivate : [AuthGuard]
  },
  {
    path: 'order-confirmation', component: OrderConfirmationComponent, canActivate : [AuthGuard]
  },
  {
    path: 'profile', component: ProfileComponent, canActivate : [AuthGuard]
  },
  {
    path: 'properties', component: PropertiesComponent,
  },
  {
    path: 'forgot-password', component: ForgotPasswordComponent
  },
  {
    path: 'reset-password', component: ResetPasswordComponent
  }
  ,
  {
    path: 'properties/detail/:id', component: PropertyDetailComponent
  }
  ,
  {
    path: 'category-browser/:id', component: ProductBrowserComponent
  },
  {
    path: 'product-finder/:keyword', component: ProductFinderComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
