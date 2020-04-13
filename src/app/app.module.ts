import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

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
import {MatExpansionModule} from '@angular/material/expansion'

import { HomeComponent } from './home/home.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {ImageSizerDirective} from './image-sizer.directive';
import { FitToChildDirective } from './fit-to-child.directive';
import { CategoriesComponent } from './categories/categories.component'
import {ApiManagerService} from './api-manager.service';
import {ShopSpineService} from './shop-spine.service'
import { CurrencyChooserComponent } from './currency-chooser/currency-chooser.component';
import { LazyLoadDirective } from './lazy-load.directive';
import { ProductComponent } from './product/product.component'



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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      {path:'category/:category', component: CategoriesComponent},
      {path:'product/:product', component: ProductComponent}
    ]),
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
    SlickCarouselModule
  ],
  providers: [ ApiManagerService, ShopSpineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
