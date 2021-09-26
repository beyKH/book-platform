// GLOBAL VARS
let watchList =  JSON.parse(localStorage.getItem("bookmarks")) || [];
let languages = [];
let countries = [];
let foundBooks = books;
let titleRegex;
let countryRegex;

// PAGINATION
let TOTAL_RESULTS = 10; //ALL OBJS TO SHOW
let PER_PAGE_COUNT = 10; // OBJS COUNT TO SHOW FOR PER PAGE
let CURRENT_PAGE = 1; // ACTIVE PAGE
let PAGES_LINK_TO_SHOW = 5; // ONLY ODD NUMBERS
let NEIGHBOUR_PAGES_COUNT = Math.floor(PAGES_LINK_TO_SHOW / 2);
let PAGES_COUNT = Math.ceil(TOTAL_RESULTS / PER_PAGE_COUNT); // TOTAL PAGES



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

// PAGINATION DOM
const elPagination = document.querySelector(".js-pagination");
const elPaginationStartLink = document.querySelector(".js-pagination-start");
const elPaginationPrevLink = document.querySelector(".js-pagination-prev");
const elPaginationList = document.querySelector(".js-pagination-list");
const elPaginationNextLink = document.querySelector(".js-pagination-next");
const elPaginationEndLink = document.querySelector(".js-pagination-end");
const elPagnationItemElementTemplate = document.querySelector("#pagination-item-template").content;


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

    elBookItem.querySelector(".js-btn-bookmark").dataset.id = book.id;

    let isOnWatchList = watchList.find(watch => watch.id === book.id);
    if(isOnWatchList){
      elBookItem.querySelector(".js-btn-bookmark").classList.add("btn-primary");
      elBookItem.querySelector(".js-btn-bookmark").classList.remove("btn-outline-primary");
    }


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


  foundBooks = findBook();
  if(foundBooks.length > 0){

    sortBooks(foundBooks , elSearchFilter);


    TOTAL_RESULTS = foundBooks.length;
    PAGES_COUNT = Math.ceil(TOTAL_RESULTS / PER_PAGE_COUNT);
    CURRENT_PAGE = 1;

    let booksToShow = foundBooks.slice(0, PER_PAGE_COUNT);


    showBooksElement(booksToShow, titleRegex);
    showPagenation();
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

      );
  })
}

// LISTENT BOOKS CLICK
function onClickBooksList(evt) {

  if(evt.target.matches(".js-btn-bookmark")){

    let objBook = books.find(book => book.id === evt.target.dataset.id);

    // CHEKING TO ADD => ELSE IF CHECKING FOR REMOVING
    if(evt.target.matches(".btn-outline-primary") ){
      // ADD TO WATCHLIST
      addToWatchlist(objBook);

      // ADD TO FRONT
      evt.target.classList.add("btn-primary");
      evt.target.classList.remove("btn-outline-primary");

      console.log(`After add: ${watchList}`);


    }else if(evt.target.matches(".btn-primary")){
      // REMOVE FROM WATHCLIST
       removeFromWatchlist(objBook.id);

      // REMOVE FROM FRONT
      evt.target.classList.remove("btn-primary");
      evt.target.classList.add("btn-outline-primary");

      console.log(`After remove: ${watchList}`);

    }

  }
}

function addToWatchlist(book) {
  localStorage.setItem("bookmarks", JSON.stringify(watchList));

  return watchList.push(book);
}

function removeFromWatchlist(bookId) {
  let index = watchList.findIndex(book => book.id === bookId);

  localStorage.setItem("bookmarks", JSON.stringify(watchList));

  return watchList.splice(index, 1);
}

function showPagenation() {


  let startIndex = (CURRENT_PAGE - 1) * PER_PAGE_COUNT;
  let endIndex = startIndex + PER_PAGE_COUNT;
  showBooksElement(foundBooks.slice(startIndex, endIndex),titleRegex)



  elPaginationList.innerHTML = "";
  let startPage = CURRENT_PAGE - NEIGHBOUR_PAGES_COUNT;
  let endPage = CURRENT_PAGE + NEIGHBOUR_PAGES_COUNT;

  PAGES_COUNT = Math.ceil(foundBooks.length / PER_PAGE_COUNT);

  if (endPage > PAGES_COUNT) {
    startPage -= Math.abs(PAGES_COUNT - endPage);
  }

  const elPageLinksFragment = document.createDocumentFragment();

  for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {

    if (pageIndex < 1) {
      endPage++;
      continue;
    }

    const elPaginationItem = elPagnationItemElementTemplate.cloneNode(true);
    elPaginationItem.querySelector(".page-link").textContent = pageIndex;
    if (pageIndex > PAGES_COUNT) {
      break;
    }

    if (pageIndex === CURRENT_PAGE) {
      elPaginationItem.querySelector("li").classList.add("active");
    }
    elPageLinksFragment.appendChild(elPaginationItem);
  }

  elPaginationList.appendChild(elPageLinksFragment);
}


// TRUE PAGINATION WORK CODE
function goToPage(pageIndex) {
  if(pageIndex > PAGES_COUNT){
    pageIndex = PAGES_COUNT;
  }

  if(pageIndex < 1){
    pageIndex = 1;
  }

  CURRENT_PAGE = pageIndex;

  if(CURRENT_PAGE === 1){
    elPaginationPrevLink.parentElement.classList.add("disabled");
  }else{
    elPaginationPrevLink.parentElement.classList.remove("disabled");
  }
  if(CURRENT_PAGE === PAGES_COUNT){
    elPaginationNextLink.parentElement.classList.add("disabled");
  }else{
    elPaginationNextLink.parentElement.classList.remove("disabled");
  }

  showPagenation();
}

function goToPrevPage() {
  goToPage(CURRENT_PAGE - 1);
  showPagenation();

}

function goToNextPage() {
  goToPage(CURRENT_PAGE + 1);
  showPagenation();
}

function goToLastPage() {
  goToPage(PAGES_COUNT);
  showPagenation();
}

function goToFirstPage() {
  goToPage(1);
  showPagenation();
}


// ADDEVENT LISTENERS

if(elMainForm){
  elMainForm.addEventListener("submit",  onBookSearchFormSubmit);
}

if(elBooks){
  elBooks.addEventListener("click", onClickBooksList);
}

// PAGINATION
if(elPaginationStartLink){
  elPaginationStartLink.addEventListener("click", goToFirstPage);
}
if(elPaginationPrevLink){
  elPaginationPrevLink.addEventListener("click", goToPrevPage);
}

if(elPaginationNextLink){
  elPaginationNextLink.addEventListener("click", goToNextPage);
}

if(elPaginationEndLink){
  elPaginationEndLink.addEventListener("click", goToLastPage);
}

if(elPaginationList){
  elPaginationList.addEventListener("click", evt => {
    if(evt.target.matches(".page-link")){
      goToPage(Number(evt.target.textContent));
    }
  });
}

// FUNCTIONS RUN
gettingCountries();
showCountries();
gettingLanguages();
showLanguages();
showBooksElement(foundBooks, titleRegex);
showPagenation();
