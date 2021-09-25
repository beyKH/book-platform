// BOOKS
let languages = [];
let countries = []


// DOM
// BOOKS LIST WRAPPER
const elBooks = document.querySelector(".books");
const elBookTemplate = document.querySelector(".book-template").content;

// SEARCH FORMS
const elMainForm = document.querySelector(".js-filter-form");
const elSearchInput = elMainForm.querySelector(".js-filter-search");
const elSearchCountry = elMainForm.querySelector(".js-filter-country");
const elSearchLanguagesSelect = elMainForm.querySelector(".js-filter-language");
const elSearchYear = elMainForm.querySelector(".js-search-year");
const elSearchFilter = elMainForm.querySelector(".js-filter-specail");

// GLOBAL VARS
let titleRegex;
let countryRegex;
// FUNCTIONS CODE

// CREATING AND ALL FILMS
function showBooksElement(givenBooks, titleRegex = "") {
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

// GETTING LANGUAGES BY SINGLE
function gettingLanguages() {
  let repateadLanguages = [];

  books.forEach(book => {
    repateadLanguages.push(book.language);
  })
  for (const lang of repateadLanguages) {
    if(!languages.includes(lang)){
      languages.push(lang);
    }
  }
}

// SHOWING LANGUAGES TO USER
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

// GETTING COUNTRIES BY SINGLE
function gettingCountries() {
  books.forEach(book =>{
    if(!countries.includes(book.country)){
      countries.push(book.country);
    }
  });

};

// SHOWING COUNTRIES TO USER
function showCountries() {
  const elCountriesFragment = document.createDocumentFragment();

  for (const country of countries) {
    elCountryItem = document.createElement("option");
    elCountryItem.textContent = country;
    elCountryItem.value = country;
    elCountriesFragment.appendChild(elCountryItem);
  }

  elSearchCountry.appendChild(elCountriesFragment);

}

// FUNCTION SORTING
function sortBooks( books, elSearchFilter) {

  if( elSearchFilter.value === "newYear"){

    books.sort((a,b) => b.year - a.year);

  }else if( elSearchFilter.value === "oldYear"){

    books.sort((a,b) => a.year - b.year);

  } else if(elSearchFilter.value === "az"){

    books.sort((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    });
  }else if(elSearchFilter.value === "za"){

    books.sort((a,b) =>{
      if (a.title < b.title) return 1;
      if (a.title > b.title) return -1;
    });

  }

}

//FIND BOOK
function onBookSearchFormSubmit(evt) {
  evt.preventDefault();
  // console.log(elSearchCountry.textContent);
  titleRegex = new RegExp(elSearchInput.value.trim(), "gi");
  // countryRegex = new RegExp(elSearchCountry.value.trim(), "gi");


  let foundBooks = findBook();
  if(foundBooks.length > 0){
    sortBooks(foundBooks , elSearchFilter);
    showBooksElement(foundBooks, titleRegex);
  }

}


function findBook() {
  return books.filter( book => {

    return  (

      // FILTERING BY TITLE
      book.title.match(titleRegex)

      &&


      // FILTERING BY LANGUAGES
      (elSearchLanguagesSelect.value === "All"
      || book.language.includes(elSearchLanguagesSelect.value))

      &&

      // FILTERING COUNTRY
      (elSearchCountry.value === "All"
      || book.country.includes(elSearchCountry.value))

      &&

      // FILTERING BY YEAR
      (elSearchYear.value.trim() == "" || book.year >= Number(elSearchYear.value))

      // &&
      // // FILTERING BY FILTER


      );
  })
}




// FUNCTIONS RUN
gettingCountries();
showCountries();
gettingLanguages();
showLanguages();
showBooksElement(books, titleRegex);

// ADDEVENT LISTENERS

if(elMainForm){

  elMainForm.addEventListener("submit",  onBookSearchFormSubmit);
}

