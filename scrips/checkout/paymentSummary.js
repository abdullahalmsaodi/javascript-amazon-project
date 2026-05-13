import { cart } from "../../data/cart.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });

  let productPriceBeforTaxCents = productPriceCents + shippingPriceCents;
  let taxCents = productPriceBeforTaxCents * 0.1;
  let totalCents = productPriceBeforTaxCents + taxCents;

  let paymentHTMLSummary = "";

  paymentHTMLSummary = `  <div class="payment-summary">
          <div class="payment-summary-title">Order Summary</div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceBeforTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
        </div>`;

  let paymentElement = (document.querySelector(
    ".js-payment-summary",
  ).innerHTML = paymentHTMLSummary);

  //   document.querySelectorAll(".js-delete-quantity-link").forEach((button) => {
  //     button.addEventListener("click", () => {
  //       const productId = button.dataset.productId;
  //       removeFromCart(productId);
  //       document.querySelector(`.js-cart-item-container-${productId}`).remove();
  //     });
  //   });
}
