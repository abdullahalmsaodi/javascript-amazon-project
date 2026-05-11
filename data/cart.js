export const cart = [];

export function addToCart(productId) {
  let matchingItme;
  cart.forEach((cartIitem) => {
    if (productId === cartIitem.productId) {
      matchingItme = cartIitem;
    }
  });

  if (matchingItme) {
    matchingItme.quantity += 1;
  } else {
    cart.push({
      productId: productId,
      quantity: 1,
    });
  }
}
