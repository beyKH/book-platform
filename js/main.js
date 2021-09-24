// BOOKS
let languages = [];
let repateadLanguages = [];



// DOM
// BOOKS LIST WRAPPER
const elBooks = document.querySelector(".books");
const elBookTemplate = document.querySelector(".book-template").content;

// SEARCH FORMS
const elMainForm = document.querySelector(".js-filter-form");
const elSearchInput = elMainForm.querySelector(".js-filter-search");
const elSearchCountry = elMainForm.querySelector(".js-filter-country");
const elSearchLanguagesSelect = elMainForm.querySelector(".js-filter-language");

// GLOBAL VARS
let titleRegex;
let countryRegex;
// FUNCTIONS CODE
// CREATING AND ALL FILMS
function createBookElement(givenBooks, titleRegex = "") {
  elBooks.innerHTML = "";
  const elBooksFragment = document.createDocumentFragment();
  for (const book of givenBooks) {
    elBookItem = elBookTemplate.cloneNode(true);

    elBookItem.querySelector(".book__img").src = `img/books/${book.imageLink}`;




    if(titleRegex.source !== "(?:)" && titleRegex){
      elBookItem.querySelector(".book__title").innerHTML = book.title.replace(titleRegex, `<mark class="p-0 bg-warning">${titleRegex.source}</mark>`);
    }else{
      elBookItem.querySelector(".book__title").innerHTML = book.title;
    }

    elBookItem.querySelector(".book__author").textContent = book.author;
    elBookItem.querySelector(".book__year").textContent = book.year;
    elBookItem.querySelector(".book__pages").textContent = book.page;
    elBookItem.querySelector(".book__lang").textContent = book.language;
    elBookItem.querySelector(".book__wiki").href = book.link;

    // ADDING TO THE FRAGMENT ITEMS
    elBooksFragment.appendChild(elBookItem);
  }
  // ADDING FRAGMENT TO BOOKS LIST IN HTML
  elBooks.appendChild(elBooksFragment);
}

function gettingLanguages() {
  books.forEach(book => {
    repateadLanguages.push(book.language);
  })
  for (const lang of repateadLanguages) {
    if(!languages.includes(lang)){
      languages.push(lang);
    }
  }
}

function showLanguages() {
  const elLanguagesFragment = document.createDocumentFragment();

  for (const language of languages) {
    const elLangaugeItem = document.createElement("option");
    elLangaugeItem.textContent = language;
    elLangaugeItem.value = language;
    elLanguagesFragment.appendChild(elLangaugeItem);
  }
  elSearchLanguagesSelect.appendChild(elLanguagesFragment);
}


//FIND BOOK
function onBookSearchFormSubmit(evt) {
  evt.preventDefault();
  // console.log(elSearchCountry.textContent);
  titleRegex = new RegExp(elSearchInput.value.trim(), "gi");
  // countryRegex = new RegExp(elSearchCountry.value.trim(), "gi");

  let foundBooks = findBook();
  createBookElement(foundBooks, titleRegex);
  console.log(elSearchCountry.value);
}


function findBook() {
  return books.filter( book => {

    return  (
      book.title.match(titleRegex)
      &&
      book.country.match(elSearchCountry.value)
      &&
      (elSearchLanguagesSelect.value === "All" || book.language.includes(elSearchLanguagesSelect.value)));
  })
}




// FUNCTIONS RUN
gettingLanguages();
showLanguages();
createBookElement(books, titleRegex);


// ADDEVENT LISTENERS

if(elMainForm){
  elMainForm.addEventListener("submit",  onBookSearchFormSubmit);
}

