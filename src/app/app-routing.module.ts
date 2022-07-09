import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './component/detail/detail.component';
import { BasketComponent } from './component/basket/basket.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
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
import { HomeFoodComponent } from './component/home-food/home-food.component';
import { ChefHomeComponent } from './component/home-food/chef-home/chef-home.component';
import { FoodCheckoutComponent } from './component/home-food/food-checkout/food-checkout.component';
import { CityComponent } from './component/home-food/city/city.component';
import { ChefListComponent } from './component/home-food/chef-list/chef-list.component';
import { OrderStatusComponent } from './component/home-food/order-status/order-status.component';
import { ChefConfirmComponent } from './component/home-food/chef-confirm/chef-confirm.component';
import { CustomerProfileComponent } from './component/customer-profile/customer-profile.component';
import { SupplierProfileComponent } from './component/supplier-profile/supplier-profile.component';
import { BecomeASupplierComponent } from './component/become-a-supplier/become-a-supplier.component';
import { SupplierOrderComponent } from './component/supplier-profile/supplier-order/supplier-order.component';
import { SupplierAuthGuard } from './helpers/supplier-auth-guard';


const routes: Routes = [
  {
    path: '', component: HomeFoodComponent
  },
  {
    path: 'product/:id', component: DetailComponent
  }
  , {
    path: 'basket', component: BasketComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'delivery-address', component: CollectDeliveryAddressComponent, canActivate: [AuthGuard]
  },
  {
    path: 'collect-payment', component: CollectPaymentComponent, canActivate: [AuthGuard]
  },
  // },
  // {
  //   path: 'order-confirmation', component: OrderConfirmationComponent, canActivate: [AuthGuard]
  // },
  {
    path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]
  },
  {
    path: 'properties', component: PropertiesComponent,
  },
  {
    path: 'local-chef', component: HomeFoodComponent,
  },
  {
    path: 'forgot-password', component: ForgotPasswordComponent
  },
  {
    path: 'reset-password', component: ResetPasswordComponent
  },
  {
    path: 'properties/detail/:id', component: PropertyDetailComponent
  },
  {
    path: 'category-browser/:id', component: ProductBrowserComponent
  },
  {
    path: 'product-finder/:keyword', component: ProductFinderComponent
  },
  {
    path: 'chef/:id', component: ChefHomeComponent
  },
  {
    path: 'checkout', component: FoodCheckoutComponent
  },
  {
    path: 'city', component: CityComponent
  },
  {
    path: 'chef-list/:area', component: ChefListComponent
  },
  {
    path: 'order-status/:reference', component: OrderStatusComponent
  },
  {
    path: 'confirm-order/:reference', component: ChefConfirmComponent
  },
  {
    path: 'customer-profile', component: CustomerProfileComponent
  },
  {
    path: 'supplier-profile', component: SupplierProfileComponent , canActivate: [AuthGuard]
  },
  {
    path: 'become-a-supplier', component: BecomeASupplierComponent
  },
  {
    path: 'supplier/order', component: SupplierOrderComponent , canActivate: [SupplierAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
