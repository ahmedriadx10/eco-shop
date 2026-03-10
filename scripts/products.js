const categorButtonsContainer = elementGive("category-btns");
const productsContainer = elementGive("all-products-container");
const tabButtonsContainer = elementGive("tab-buttons");

const productsArea=elementGive('products-area')
const cartArea=elementGive('carts-area')
const modalParent=elementGive('card_modal')
const modalInner=elementGive('details-show')
async function getCategoryList() {
  const getCateList = await fetch(
    "https://dummyjson.com/products/category-list",
  );
  const convJsData = await getCateList.json();

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
  const productsData = await fetch("https://dummyjson.com/products");

  const convertJsData = await productsData.json();
  const { products } = convertJsData;
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

      <div class="product-card card bg-base-100 h-full w-full shadow-sm">
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
      <button data-id='${id}' class="cart-add-btn btn btn-info">Add to Cart</button>
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
  const take = await fetch(
    `https://dummyjson.com/products/category/${categoryName}`,
  );
  const convertData = await take.json();

  const { products } = convertData;

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

const innerTextBtn=tabButton.innerText

if(innerTextBtn==='Products'){
 
cartArea.classList.add('hidden')
productsArea.classList.remove('hidden')
  

}
else{
  productsArea.classList.add('hidden')
  cartArea.classList.remove('hidden')
}

  }
});


async function specificProduct(id){


const product=await fetch(`https://dummyjson.com/products/${id}`)
const convertProduct=await product.json()

modalCall(convertProduct)

}


function modalCall(data){

const {title,description,price,category,brand,images:[image]}=data



modalInner.innerHTML=`
<div><img src="${image}" alt="" class="h-60 w-full rounded-lg"></div>


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

`



modalParent.showModal()

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

productsContainer.addEventListener('click',(e)=>{

  const targetElement=e.target

if(targetElement.classList.contains('card-details')){

  const getId=targetElement.dataset.id

 specificProduct(Number(getId))




}


})