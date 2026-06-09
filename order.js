let orderData = {};
let cart = [];

fetch('order.json')
  .then(response => response.json())
  .then(data => {
    orderData = data;
    populateTables(data.tables);
    displayProducts(data.products);
  });

function populateTables(tables) {
  const select = document.getElementById('tableSelect');
  tables.forEach(t => {
    const option = document.createElement('option');
    option.value = t;
    option.textContent = `Τραπέζι ${t}`;
    select.appendChild(option);
  });
}

function displayProducts(products) {
  const container = document.getElementById('productsContainer');
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';

    const img = document.createElement('img');
    img.src = p.image;

    const details = document.createElement('div');
    details.className = 'product-details';

    const name = document.createElement('div');
    name.className = 'product-name';
    name.textContent = p.name.el;

    const desc = document.createElement('div');
    desc.textContent = p.description.el;

    const price = document.createElement('div');
    price.className = 'product-price';
    price.textContent = `${p.price} €`;

    const qty = document.createElement('input');
    qty.type = 'number';
    qty.min = 0;
    qty.value = 0;
    qty.className = 'quantity';
    qty.addEventListener('change', () => updateCart(p, parseInt(qty.value)));

    details.appendChild(name);
    details.appendChild(desc);
    details.appendChild(price);
    div.appendChild(img);
    div.appendChild(details);
    div.appendChild(qty);

    container.appendChild(div);
  });
}

function updateCart(product, quantity) {
  const index = cart.findIndex(item => item.product.name.el === product.name.el);
  if (index > -1) {
    if (quantity === 0) cart.splice(index,1);
    else cart[index].quantity = quantity;
  } else if (quantity > 0) {
    cart.push({product, quantity});
  }
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById('cartItems');
  cartList.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.product.name.el} x${item.quantity} - ${(item.product.price * item.quantity).toFixed(2)} €`;
    cartList.appendChild(li);
  });
}

document.getElementById('submitOrder').addEventListener('click', () => {
  const table = document.getElementById('tableSelect').value;
  if (cart.length === 0) {
    alert('Το καλάθι είναι άδειο!');
    return;
  }
  
  alert(`Παραγγελία για Τραπέζι ${table}:\n` + cart.map(i => `${i.product.name.el} x${i.quantity}`).join('\n'));
  
  cart = [];
  renderCart();
  document.querySelectorAll('.quantity').forEach(input => input.value = 0);
});
