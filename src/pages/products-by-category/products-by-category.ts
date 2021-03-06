import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductDetailsPage } from './../product-details/product-details';

import { WoocommerceProvider } from '../../providers/woocommerce/woocommerce';

@Component({
  selector: 'page-products-by-category',
  templateUrl: 'products-by-category.html',
})
export class ProductsByCategoryPage {
  wooCommerce: any;
  products: any[];
  page: number;
  category: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public WP: WoocommerceProvider) {
    this.page = 1;
    this.category = this.navParams.get('category');

    this.wooCommerce = WP.init();

    this.wooCommerce.getAsync("products?filter[category]=" + this.category.slug).then( (data) => {
      this.products = JSON.parse(data.body).products;
      console.log(this.products);
    }, (err) =>{
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsByCategoryPage');
  }

  loadMoreProducts(event) {
    this.page++;
    console.log("Getting Page:" + this.page);
    this.wooCommerce.getAsync("products?filter[category]=" + this.category.slug + "&page=" + this.page).then( (data) => {
      this.products = this.products.concat(JSON.parse(data.body).products);
      console.log(this.products);
      event.complete();
      if(JSON.parse(data.body).products,length < 10)
        event.enable(false);
    }, (err) =>{
      console.log(err);
    });
  }

  openProductPage(product) {
    this.navCtrl.push(ProductDetailsPage, { "product": product });
  }

}
