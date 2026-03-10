const categorButtonsContainer = elementGive("category-btns");

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
