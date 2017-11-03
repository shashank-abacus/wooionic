import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CartPage } from './../cart/cart';

import * as WC from 'woocommerce-api';

@Component({
  selector: 'page-product-details',
  templateUrl: 'product-details.html',
})
export class ProductDetailsPage {
  product: any;
  wooCommerce: any;
  reviews: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage, public toastCtrl: ToastController, public modalCtrl: ModalController) {
    this.product = this.navParams.get("product");
    console.log(this.product);
    
    this.wooCommerce = WC({
      url: "http://localhost/wooionic",
      consumerKey: "ck_ca082272b84a6c6be2f8303861002c41e6062229",
      consumerSecret: "cs_8e478a8ab1c621f66dac5fc30d15b37223e63ca0"
    });

    this.wooCommerce.getAsync("products/"+this.product.id+'/reviews').then((data) => {
      this.reviews = JSON.parse(data.body).product_reviews;
      console.log(this.reviews);
    }, (err) => {
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailsPage');
  }

  addToCart(product) {
    this.storage.get("cart").then((data) => {
      console.log(data);
      if(data == null || data.length == 0) {
        data = [];
        data.push({
          "product": product,
          "qty": 1,
          "amount": parseFloat(product.price)
        });
      } else {
        let added = 0;
        for(let i=0; i<data.length; i++) {
          if (product.id == data[i].product.id) {
            console.log("Product is alreay available in the cart.");
            let qty = data[i].qty;
            data[i].qty = qty+1;
            data[i].amount = parseFloat(data[i].amount) + parseFloat(data[i].product.price);
            added = 1;
          }
        }
        if(added == 0) {
          data.push({
            "product": product,
            "qty": 1,
            "amount": parseFloat(product.price)
          });
        }
      }
      this.storage.set("cart", data).then((data) => {
        console.log("Cart Updated.");
        console.log(data);
        this.toastCtrl.create({
          message: "Cart Updated",
          duration: 3000,
        }).present();
      })
    });
  }

  opencart() {
    this.modalCtrl.create(CartPage).present();
  }

}
