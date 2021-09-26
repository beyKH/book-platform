let TOTAL_RESULTS = 200; //ALL OBJS TO SHOW
let PER_PAGE_COUNT = 10; // OBJS COUNT TO SHOW FOR PER PAGE
let CURRENT_PAGE = 5; // ACTIVE PAGE
let PAGES_LINK_TO_SHOW = 5; // ONLY ODD NUMBERS
let NEIGHBOUR_PAGES_COUNT = Math.floor(PAGES_LINK_TO_SHOW / 2);
let PAGES_COUNT = Math.ceil(TOTAL_RESULTS / PER_PAGE_COUNT); // TOTAL PAGES

// DOM
const elPagination = document.querySelector(".js-pagination");
const elPaginationStartLink = document.querySelector(".js-pagination-start");
const elPaginationPrevLink = document.querySelector(".js-pagination-prev");
const elPaginationList = document.querySelector(".js-pagination-list");
const elPaginationNextLink = document.querySelector(".js-pagination-next");
const elPaginationEndLink = document.querySelector(".js-pagination-end");



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

const elPagnationItemElementTemplate = document.querySelector("#pagination-item-template").content;
function showPagenation() {
  elPaginationList.innerHTML = "";
  let startPage = CURRENT_PAGE - NEIGHBOUR_PAGES_COUNT;
  let endPage = CURRENT_PAGE + NEIGHBOUR_PAGES_COUNT;

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

showPagenation();
