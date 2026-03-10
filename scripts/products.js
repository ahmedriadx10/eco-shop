const categorButtonsContainer = elementGive("category-btns");
const productsContainer = elementGive("all-products-container");
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

    btn.className = "category-btn btn btn-ghost w-full";

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

      <div class="card bg-base-100 h-full w-full shadow-sm">
  <figure>
    <img
      src="${image}"
      alt="${title}" class='h-72 w-full' />
  </figure>
  <div class="card-body">
    <h2 class="card-title">${title}</h2>
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
