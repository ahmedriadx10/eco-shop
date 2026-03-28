const categorButtonsContainer = elementGive("category-btns");
const productsContainer = elementGive("all-products-container");
const tabButtonsContainer = elementGive("tab-buttons");
const cartStore = elementGive("cart-store-container");
const productsArea = elementGive("products-area");
const cartArea = elementGive("carts-area");
const modalParent = elementGive("card_modal");
const modalInner = elementGive("details-show");
const userCartTotal = elementGive("cart-total");
const navCartCount = elementGive("cart-count-nav");

let localStorageCartData = JSON.parse(localStorage.getItem("cartStore")) || [];
async function getCategoryList() {
  categoryLoading(true);
  const getCateList = await fetch(
    "https://dummyjson.com/products/category-list",
  );
  const convJsData = await getCateList.json();
  categoryLoading(false);
  categoryBtnsRender(convJsData);
}

function categoryBtnsRender(container) {
  container.forEach((x) => {
    const btn = document.createElement("button");

    btn.innerText = x;

    btn.className = "category-btn btn btn-ghost";

    categorButtonsContainer.appendChild(btn);
  });
}

getCategoryList();

async function getAllProductsData() {
  allProductsLoading(true);

  const productsData = await fetch("https://dummyjson.com/products");

  const convertJsData = await productsData.json();
  const { products } = convertJsData;
  allProductsLoading(false);
  renderProductsDataUI(products);
}

function renderProductsDataUI(x) {


  productsContainer.innerHTML = "";

  x.forEach((card) => {
    const {
      id,
      title,
      description,
      category,
      price,
      images: [image],
    } = card;

    const cardDiv = document.createElement("div");

    cardDiv.innerHTML = `

      <div class="product-card card bg-base-100  w-full shadow-sm">
  <figure>
    <img
      src="${image}"
      alt="${title}" class='h-72 w-full' />
  </figure>
  <div class="card-body">
    <h2  data-id='${id}'  class="card-details  card-title hover:text-info cursor-pointer hover:underline">${title}</h2>
    <p class="line-clamp-2 ">${description}</p>
     <span class="badge badge-primary badge-soft">${category}</span>
    <p class="font-medium text-lg">Price: $${price}</p>

    <div class="card-actions justify-end">
      <button data-id=${id} data-name='${title}' class="cart-add-btn btn btn-info">Add to Cart</button>
    </div>
  </div>
</div>

`;

    productsContainer.appendChild(cardDiv);
  });


   
}

getAllProductsData();

categorButtonsContainer.addEventListener("click", (e) => {
  const targetButton = e.target;

  if (targetButton.classList.contains("category-btn")) {
    const allButtons = categorButtonsContainer.querySelectorAll("button");

    allButtons.forEach((button) => {
      button.classList.remove("btn-info");
      button.classList.add("btn-ghost");
    });

    targetButton.classList.remove("btn-ghost");
    targetButton.classList.add("btn-info");

    if (targetButton.innerText === "All") {
      getAllProductsData();
    } else {
      const getButtonInnerText = targetButton.innerText;

      categoryWiseProducts(getButtonInnerText);
    }
  }
});

async function categoryWiseProducts(categoryName) {
  allProductsLoading(true)
  const take = await fetch(
    `https://dummyjson.com/products/category/${categoryName}`,
  );
  const convertData = await take.json();

  const { products } = convertData;
 allProductsLoading(false)
  renderProductsDataUI(products);
}

tabButtonsContainer.addEventListener("click", (e) => {
  const tabButton = e.target;

  if (tabButton.classList.contains("tab-btn")) {
    const allTabBtns = tabButtonsContainer.querySelectorAll("button");

    allTabBtns.forEach((button) => {
      button.classList.remove("btn-info");
    });

    tabButton.classList.add("btn-info");

    const innerTextBtn = tabButton.innerText;

    if (innerTextBtn === "Products") {
      cartArea.classList.add("hidden");
      productsArea.classList.remove("hidden");
    } else {
      productsArea.classList.add("hidden");
      cartArea.classList.remove("hidden");
    }
  }
});

async function specificProduct(id) {
  const product = await fetch(`https://dummyjson.com/products/${id}`);
  const convertProduct = await product.json();

  addToCart(convertProduct);
}

async function specificProductForModal(id) {
  modalInner.innerHTML=''
  modalParent.showModal()
 modalLoading(true)
  const product = await fetch(`https://dummyjson.com/products/${id}`);
  const convertProduct = await product.json();
  modalLoading(false)
  modalCall(convertProduct);
}

function addToCart(data) {
  const { id, title, price } = data;

  const cartObj = {
    id,
    title,
    quantity: 1,
    price,
  };

  const findCart = localStorageCartData.find((x) => x.id === id);

  if (findCart) {
    findCart.quantity += 1;
    localStorage.setItem("cartStore", JSON.stringify(localStorageCartData));
    renderCart(localStorageCartData);
  } else {
    localStorageCartData.push(cartObj);
    localStorage.setItem("cartStore", JSON.stringify(localStorageCartData));
    renderCart(localStorageCartData);
  }
}

function renderCart(x) {
  if (!x.length) {
    cartStore.innerHTML = "";
    const div = document.createElement("div");
    div.innerHTML = `
    
    <h2 class=' text-7xl'><i class="text-info fa-solid fa-face-rolling-eyes"></i></h2>
    <p class='font-semibold text-2xl '>Your cart is Empthy 🔔❗</p>
    `;
    userCartTotal.innerText = 0;
    cartStore.appendChild(div);
    div.className = "col-span-full text-center space-y-5";
    navCartCount.innerText = `+0`;
    return;
  }

  cartStore.innerHTML = "";

  x.forEach((cartData) => {
    const { id, title, price, quantity } = cartData;
    const cart = document.createElement("div");
    cart.innerHTML = `
  
  <div class="card  bg-base-100 shadow-sm p-5"> 
<h2 class="font-bold text-2xl">${title}</h2>
    <p class="font-medium flex justify-between text-lg">Quantity: <span>X<span>${quantity}</span></span></p>
    <p class="font-medium flex justify-between text-lg">price: <span>$<span>${price * quantity}</span></span></p>
    <div class="flex justify-end py-2"><button data-id='${id}' data-name='${title}'  class="remove-btn btn btn-info">Remove</button></div>
</div> 

  `;
    cartStore.appendChild(cart);
  });

  // const getCartDataFromStorage=JSON.parse(localStorage.getItem('cartStore'))
  const calcTotal = localStorageCartData.reduce(
    (acc, curr) => acc + curr.price * curr.quantity,
    0,
  );
  userCartTotal.innerText = parseFloat(calcTotal.toFixed(2));
  navCartCount.innerText = `+${localStorageCartData.length}`;
}

renderCart(localStorageCartData);

function modalCall(data) {
  const {
    title,
    description,
    price,
    category,
    brand,
    images: [image],
  } = data;

  modalInner.innerHTML = `
<div><img src="${image}" alt="" class=" w-full rounded-lg"></div>


<div class="space-y-2">
  <!-- intro -->
<div>
  <h2 class="card-title">${title}</h2>
<p class='mt-2'>${description}</p>
</div>

<!-- category and price -->

<div class='space-y-2'>
  <p class="badge badge-info badge-soft">${category}</p>
  <p class= 'font-medium card-title'>Price: $${price}</p>

</div>

</div>

`;



}

/**
 * {
    "id": 1,
    "title": "Essence Mascara Lash Princess",
    "description": "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
    "category": "beauty",
    "price": 9.99,
    "discountPercentage": 10.48,
    "rating": 2.56,
    "stock": 99,
    "tags": [
        "beauty",
        "mascara"
    ],
    "brand": "Essence",
    "sku": "BEA-ESS-ESS-001",
    "weight": 4,
    "dimensions": {
        "width": 15.14,
        "height": 13.08,
        "depth": 22.99
    },
    "warrantyInformation": "1 week warranty",
    "shippingInformation": "Ships in 3-5 business days",
    "availabilityStatus": "In Stock",
    "reviews": [
        {
            "rating": 3,
            "comment": "Would not recommend!",
            "date": "2025-04-30T09:41:02.053Z",
            "reviewerName": "Eleanor Collins",
            "reviewerEmail": "eleanor.collins@x.dummyjson.com"
        },
        {
            "rating": 4,
            "comment": "Very satisfied!",
            "date": "2025-04-30T09:41:02.053Z",
            "reviewerName": "Lucas Gordon",
            "reviewerEmail": "lucas.gordon@x.dummyjson.com"
        },
        {
            "rating": 5,
            "comment": "Highly impressed!",
            "date": "2025-04-30T09:41:02.053Z",
            "reviewerName": "Eleanor Collins",
            "reviewerEmail": "eleanor.collins@x.dummyjson.com"
        }
    ],
    "returnPolicy": "No return policy",
    "minimumOrderQuantity": 48,
    "meta": {
        "createdAt": "2025-04-30T09:41:02.053Z",
        "updatedAt": "2025-04-30T09:41:02.053Z",
        "barcode": "5784719087687",
        "qrCode": "https://cdn.dummyjson.com/public/qr-code.png"
    },
    "images": [
        "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp"
    ],
    "thumbnail": "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/thumbnail.webp"
}
 */

productsContainer.addEventListener("click", (e) => {
  const targetElement = e.target;

  if (targetElement.classList.contains("card-details")) {
    const getId = targetElement.dataset.id;

   specificProductForModal(Number(getId));
  } else if (targetElement.classList.contains("cart-add-btn")) {
    const productsMiniDetails = targetElement.dataset;

    const { id, name } = productsMiniDetails;

    specificProduct(Number(id));
    showToastify(`<span class='font-bold text-md'>${name}</span> <span class='font-medium'>Add to cart successfull !</span>`, true);
  }
});

// cart store event eventListener

cartStore.addEventListener("click", (e) => {
  const removeBtn = e.target;

  if (removeBtn.classList.contains("remove-btn")) {
    const productsMiniDetails = removeBtn.dataset;

    const { id, name } = productsMiniDetails;

    localStorageCartData = localStorageCartData.filter(
      (cart) => cart.id !== Number(id),
    );

    localStorage.setItem("cartStore", JSON.stringify(localStorageCartData));

    showToastify(`<span class='font-bold text-md'>${name}</span> <span class='font-medium'>removed from your cart</span>`);
    renderCart(localStorageCartData);
  }
});

function showToastify(toastData, success) {
  if (success) {
    const alertContainer = document.createElement("div");
    alertContainer.innerHTML = `
<div class="toast  toast-end toast-middle">

  <div class="alert alert-info ">
    <span>${toastData}</span>
  </div>
</div>`;

    document.body.appendChild(alertContainer);
    setTimeout(() => {
      alertContainer.remove();
    }, 3000);
    return;
  }

  const alertContainer = document.createElement("div");
  alertContainer.innerHTML = `
<div class="toast toast-end toast-middle">

  <div class="alert alert-warning ">
    <span>${toastData}</span>
  </div>
</div>`;

  document.body.appendChild(alertContainer);
  setTimeout(() => {
    alertContainer.remove();
  }, 2000);
}

function allProductsLoading(loading) {
  const productsLoading = elementGive("products-loading");

  if (loading) {
    productsLoading.classList.remove("hidden");
    productsContainer.classList.add("hidden");
  } else {
    productsContainer.classList.remove("hidden");
    productsLoading.classList.add("hidden");
  }
}

function categoryLoading(wanna) {
  const categoryLoading = elementGive("category-loading");
  if (wanna) {
    categoryLoading.classList.remove("hidden");
    categorButtonsContainer.classList.add("hidden");
  } else {
    categoryLoading.classList.add("hidden");
    categorButtonsContainer.classList.remove("hidden");
  }
}

function modalLoading(wanna) {
  const loading = elementGive("modal-loading");
  
  if(wanna){
    loading.classList.remove('hidden')
    modalInner.classList.add('remove')
  }
  else{
    modalInner.classList.remove('hidden')
    loading.classList.add('hidden')
  }
}




function cartView(destination){
// here i used falsy that means if don't send any parameter that means undefined

  if(destination){
      productsArea.classList.remove('hidden')
  cartArea.classList.add('hidden')
  elementGive('products-btn').classList.add('btn-info')
  elementGive('cart-btn').classList.remove('btn-info')
    return
  }
  
  productsArea.classList.add('hidden')
  cartArea.classList.remove('hidden')
  elementGive('products-btn').classList.remove('btn-info')
  elementGive('cart-btn').classList.add('btn-info')

}