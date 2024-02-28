import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutocompleteComponent } from 'src/app/google-places.component';
import { CurrencyMaskModule,CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask";
//import { CurrencyMaskConfig, CURRENCY_MASK_CONFIG } from "ng2-currency-mask/src/currency-mask.config";
import { EditorModule } from '@tinymce/tinymce-angular';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { TopSearchBarComponent } from '../portal/top-search-bar/top-search-bar.component';
import { CategoriesHeaderComponent } from '../portal/categories-header/categories-header.component';

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "left",
  allowNegative: false,
  decimal: ".",
  precision: 2,
  prefix: "",
  suffix: "",
  thousands: ","
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CurrencyMaskModule,
    EditorModule,
    AutocompleteLibModule
  ],
  declarations: [
    AutocompleteComponent,
    CategoriesHeaderComponent,
    TopSearchBarComponent
  ],
  providers: [
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig }
  ],
  exports: [
    AutocompleteComponent,
    CurrencyMaskModule,
    EditorModule,
    AutocompleteLibModule,
    CategoriesHeaderComponent,
    TopSearchBarComponent
  ]
})
export class SharedModule { }
