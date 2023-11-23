import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem){
    //check if we already have item

    let alreadyExistsInCart: boolean = false;
    let existingCardItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      //find the item in the cart based on the id

      
      existingCardItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      
      //check if we found it

      alreadyExistsInCart = (existingCardItem !== undefined);
    }

    if (alreadyExistsInCart && existingCardItem !== undefined) {
      // Perform a null check before accessing properties
      existingCardItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotal();


  }

  computeCartTotal() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //publish the new values
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
  }


  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contetn of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`Name=${tempCartItem.name}, Quantity=${tempCartItem.quantity}, Price=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`)
    }

    console.log(`TotalPrice: ${totalPriceValue.toFixed(2)}, TotalQuantity: ${totalQuantityValue}`);
    console.log(`-------------------`);
  }
}
