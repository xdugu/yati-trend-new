import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, UrlSegment, UrlSegmentGroup, Route } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxPayPalModule } from 'ngx-paypal';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import localeHuExtra from '@angular/common/locales/extra/hu';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatCardModule} from '@angular/material/card';
import { HeaderComponent } from './header/header.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon'
import {LayoutModule} from '@angular/cdk/layout';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatBadgeModule} from '@angular/material/badge';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list'
import {MatChipsModule} from '@angular/material/chips';
import {MatTreeModule} from '@angular/material/tree';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { HomeComponent } from './home/home.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {ImageSizerDirective} from './image-sizer.directive';
import { FitToChildDirective } from './fit-to-child.directive';
import { CategoriesComponent } from './categories/categories.component'
import {ApiManagerService} from './api-manager.service';
import {ShopSpineService} from './shop-spine.service'
import { CurrencyChooserComponent } from './currency-chooser/currency-chooser.component';
import { LazyLoadDirective } from './lazy-load.directive';
import { ProductComponent } from './product/product.component';
import { BasketComponent } from './basket/basket.component';
import { CheckoutComponent, DialogShowFoxpostAddress } from './checkout/checkout.component';
import { ReviewComponent, DialogConfirmPaymentMethod, DialogConfirmOrderSuccessful } from './review/review.component';
import { SearchPipe } from './search.pipe';
import { HelpComponent } from './help/help.component'

registerLocaleData(localeHu, 'hu-Hu', localeHuExtra);


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ImageSizerDirective,
    FitToChildDirective,
    CategoriesComponent,
    CurrencyChooserComponent,
    LazyLoadDirective,
    ProductComponent,
    BasketComponent,
    CheckoutComponent,
    ReviewComponent,
    DialogConfirmPaymentMethod,
    DialogConfirmOrderSuccessful,
    DialogShowFoxpostAddress,
    SearchPipe,
    HelpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponent },
      {matcher: AppModule.resolveRoute, component: CategoriesComponent},
      {path:'product/:product', component: ProductComponent},
      {path:'basket', component: BasketComponent},
      {path:'checkout', component: CheckoutComponent},
      {path:'review', component: ReviewComponent},
      {path:'legal', component: HelpComponent},
    ]),
    NgxPayPalModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatCardModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    LayoutModule,
    MatSidenavModule,
    MatBadgeModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatSelectModule,
    MatRadioModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCheckboxModule,
    SlickCarouselModule,
    MatListModule,
    MatChipsModule,
    MatTreeModule,
    MatProgressSpinnerModule
  ],
  providers: [ ApiManagerService, ShopSpineService],
  bootstrap: [AppComponent]
})


export class AppModule { 

  // custom route matching function - currentlybeing used only for category matching
  static resolveRoute(url: UrlSegment[]) {
      if(url[0].path.match('category'))
      {
        let str = url[1].path;

        // concatenate the rest of the category paths together
        for(let i = 2; i < url.length; i++){
            str+= '>' + url[i].path;
        }
        return ({consumed: url, posParams: {'category' : new UrlSegment(str, {})}});
      }else {
        return null;
      }
  }
  
}
