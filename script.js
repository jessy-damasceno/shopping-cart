const cartItems = document.querySelector('.cart__items');
const cleanCartButton = document.querySelector('.empty-cart');
const cart = document.querySelector('.cart');

function cleanCart() {
  cartItems.innerHTML = '';
  saveCartItems(cartItems.innerHTML);
}

function somaCart() {
  const totalPrice = document.querySelector('.total-price');
  const array = cartItems.innerHTML.match(/\$\d{1,9}(?:\.\d{1,2})|\$\d{1,9}/g);
  if (array) {
  const valores = array
    .join('')
    .replace(/\$/g, ' ')
    .split(' ')
    .splice(1);
  const loucura = valores.reduce((acc, cur) => acc + parseFloat(cur), 0);
  const outa = parseInt(loucura, 10);
  totalPrice.innerHTML = `${(loucura === outa) ? outa : Number(loucura).toFixed(2)}`;
  } else {
    totalPrice.innerHTML = '0';
  }
}

cleanCartButton.addEventListener('click', cleanCart);

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  if (event.target !== cartItems) {
    somaCart();
    event.target.remove();
    saveCartItems(cartItems.innerHTML);
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function cartAdd(event) {
  const id = event.target.parentNode.querySelector('.item__sku').innerText;
  const response = await fetchItem(id);
  const element = createCartItemElement({ sku: response.id,
    name: response.title,
    salePrice: response.price });
  cartItems.appendChild(element);
  saveCartItems(cartItems.innerHTML);
  somaCart();
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', cartAdd);
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(button);
  return section;
}

window.onload = async () => {
  const itemsContainer = document.querySelector('.items');
  itemsContainer.appendChild(createCustomElement('p', 'loading', 'carregando...'));
  const products = await fetchProducts('computador');
  itemsContainer.removeChild(document.querySelector('.loading'));
  products.results.forEach((product) => {
    const { id: sku, title: name, thumbnail: image } = product;
    itemsContainer.appendChild(createProductItemElement({ sku, name, image }));
  });
  cartItems.innerHTML = getSavedCartItems();
  cartItems.addEventListener('click', cartItemClickListener);
  cart.appendChild(createCustomElement('span', 'total-price', '0'));
};
