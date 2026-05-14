import { cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";

import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary() {
  let cartHTMLSummary = "";
  cart.forEach((cartItem) => {
    let productId = cartItem.productId;
    let product = getProduct(productId);

    let deliveryOpationId = cartItem.deliveryOptionId;
    let deliveryOption = getDeliveryOption(deliveryOpationId);

    const today = dayjs();

    const deliveryDay = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDay.format("dddd, MMMM  d");

    cartHTMLSummary += `  <div class="cart-item-container js-cart-item-container-${productId}">
            <div class="delivery-date">Delivery date: ${dateString}</div>

            <div class="cart-item-details-grid">
              <img
                class="product-image"
                src="${product.image}"
              />

              <div class="cart-item-details"> 
                <div class="product-name">
                  ${product.name}
                </div>
                <div class="product-price">$${product.getPrice()}</div>
                <div class="product-quantity">
                  <span> Quantity: <span class="quantity-label">${cartItem.quantity}</span> </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id="${product.id}">
                    Delete
                  </span>
                </div>
              </div>

                <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
              ${deliveryOptionsHTML(product, cartItem)}

                
                </div>
              </div>
            </div>
          </div>`;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let HTML = "";

    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();

      const deliveryDay = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDay.format("dddd, MMMM  d");

      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const ischecked = deliveryOption.id === cartItem.deliveryOptionId;
      HTML += `<div class="delivery-option  js-delivery-options" data-product-id="${matchingProduct.id}" data-delivery-option-id="${deliveryOption.id}">
                  <input
                    type="radio"
                     ${ischecked ? "checked" : ""}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}"
                  />
                  <div>
                    <div class="delivery-option-date">${dateString} </div>
                    <div class="delivery-option-price">${priceString} Shipping</div>
                  </div>
                </div>`;
    });

    return HTML;
  }

  document.querySelector(".js-order-summary").innerHTML = cartHTMLSummary;
  document.querySelectorAll(".js-delete-quantity-link").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      removeFromCart(productId);
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`,
      );
      container.remove();

      renderPaymentSummary();
    });
  });

  document.querySelectorAll(".js-delivery-options").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });
}
