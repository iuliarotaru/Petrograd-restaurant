//SELECT ELEMENTS
//-------------------------------------------------
const template = document.querySelector("#myTemp").content;
const main = document.querySelector("main");
const allLink = document.querySelector("#all");
const nav = document.querySelector("nav");
const modalbg = document.querySelector(".modalbg");
const modal = document.querySelector("#modal");

//API ENDPOINTS
//---------------------------------------------------
const productlistLink = "http://kea-alt-del.dk/t5/api/productlist";
const catLink = "http://kea-alt-del.dk/t5/api/categories";
const productLink = "http://kea-alt-del.dk/t5/api/product?id=";
const imgLink = "https://kea-alt-del.dk/t5/site/imgs/";

//ADD EVENTLISTENERS
//----------------------------------------------------
allLink.addEventListener("click", () => showCategory("all"));
modal.addEventListener("click", () => modalbg.classList.add("hide"));

//FUNCTIONS
//-----------------------------------------------------
function createCatSections(categories) {
  console.log(categories);
  categories.forEach(cat => {
    const newSection = document.createElement("section");
    const newHeader = document.createElement("h2");
    const newA = document.createElement("a");
    newA.textContent = cat;
    newA.href = "#";
    newA.addEventListener("click", () => showCategory(cat));
    nav.appendChild(newA);
    newSection.id = cat;
    newHeader.textContent = cat;
    main.appendChild(newHeader);
    main.appendChild(newSection);
  });

  fetch(productlistLink)
    .then(e => e.json())
    .then(data => data.forEach(showData));
}

function showCategory(category) {
  console.log(category);
  document.querySelectorAll("main section").forEach(section => {
    if (section.id == category || category == "all") {
      section.style.display = "grid";
      section.previousElementSibling.style.display = "block";
    } else {
      section.style.display = "none";
      section.previousElementSibling.style.display = "none";
    }
  });
}

function showData(product) {
  const section = document.querySelector("#" + product.category);
  let clone = template.cloneNode(true);

  clone.querySelector("h2").textContent = product.name;
  clone.querySelector("h3").textContent = product.price + ", -kr";
  clone.querySelector("p.description").textContent = product.shortdescription;
  clone.querySelector("img").src =
    "https://kea-alt-del.dk/t5/site/imgs/small/" + product.image + "-sm.jpg";
  clone.querySelector("button").addEventListener("click", () => {
    fetch(productLink + product.id)
      .then(e => e.json())
      .then(data => showDetails(data));
  });

  if (product.discount) {
    const elm = clone.querySelector(".discount");
    elm.classList.remove("hide");
    elm.textContent = "Discount: " + product.discount + "%";
  }

  if (product.alcohol) {
    const alc = clone.querySelector(".alcohol");
    alc.classList.remove("hide");
    alc.textContent = "Alcohol: " + product.alcohol + "%";
  }

  if (product.vegetarian == false) {
    clone.querySelector(".vegetarian").remove();
  }

  if (product.soldout) {
    const article = clone.querySelector("article");
    article.classList.add("soldout");
    const message = document.createElement("p");
    message.textContent = "!Sold Out";
    message.classList.add("overlay");
    article.appendChild(message);
  }

  section.appendChild(clone);
}

function showDetails(data) {
  console.log(data);
  modal.querySelector(".modal-name").textContent = data.name;
  modal.querySelector(".modal-description").textContent = data.longdescription;

  modal.querySelector(".modal-price").textContent =
    "New price: " + (data.price - (data.price * data.discount) / 100) + ", -Kr";
  modal.querySelector("img").src = imgLink + "medium/" + data.image + "-md.jpg";
  modal.querySelector(".modal-region").textContent = "Region: " + data.region;
  modal.querySelector(".modal-allergens").textContent =
    "Allergens: " + data.allergens;
  modal.querySelector(".modal-stars").textContent = "Stars: " + data.stars;
  modalbg.classList.remove("hide");
}

//FETCHING THE CATEGORIES
fetch(catLink)
  .then(e => e.json())
  .then(data => createCatSections(data));
