/** Modules */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreeModule } from 'angular-tree-component'

/** Components */
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { DetailComponent } from './component/detail/detail.component';
import { HomeComponent } from './component/home/home.component';
import { BasketComponent } from './component/basket/basket.component';
import { LoginComponent } from './component/login/login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BasketItemComponent } from './component/basket/basket-item/basket-item.component';
import { AddressComponent } from './component/forms/address/address.component';
import { CheckoutItemComponent } from './component/checkout/checkout-item/checkout-item.component';
import { AppToastComponent } from './component/common/app-toast/app-toast.component';
import { AppToastService } from './service/AppToastService';
import { ItemComponent } from './component/home/item/item.component';
import { RegisterComponent } from './component/register/register.component';
import { AlertComponent } from './component/alert/alert.component';
import { OrderConfirmationComponent } from './component/order/order-confirmation/order-confirmation.component';
import { ProfileComponent } from './component/profile/profile.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ProductBrowserComponent } from './component/product-browser/product-browser.component';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { NavBarComponent } from './component/nav-bar/nav-bar.component';
import { SmallItemComponent } from './component/home/small-item/small-item.component';
import { CollectDeliveryAddressComponent } from './component/checkout/collect-delivery-address/collect-delivery-address.component';
import { CollectPaymentComponent } from './component/checkout/collect-payment/collect-payment.component';
import { OrderItemComponent } from './component/profile/order-item/order-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DetailComponent,
    HomeComponent,
    BasketComponent,
    LoginComponent,
    BasketItemComponent,
    AddressComponent,
    CheckoutItemComponent,
    AppToastComponent,
    ItemComponent,
    RegisterComponent,
    AlertComponent,
    OrderConfirmationComponent,
    ProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProductBrowserComponent,
    DateAgoPipe,
    NavBarComponent,
    SmallItemComponent,
    CollectDeliveryAddressComponent,
    CollectPaymentComponent,
    OrderItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule,
    TreeModule.forRoot()
  ],
  providers: [AppToastService],
  bootstrap: [AppComponent]
})
export class AppModule { }
