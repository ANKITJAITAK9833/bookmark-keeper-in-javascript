const modal = document.getElementById('modal');
const modalShow =document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = [];
// Show Modal, Focus On Input
function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Event Listeners
modalShow.addEventListener('click',showModal);
modalClose.addEventListener('click',()=> modal.classList.remove('show-modal'));
window.addEventListener('click',(e)=>(e.target === modal? modal.classList.remove('show-modal'): false));

// Validate Form
function validate(nameValue, urlValue) {
    const expression =/(https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue){
        alert('Please enter values for both the fields');
        return false;
    }
    if(!urlValue.match(regex)){
        alert('Please provide a valid web address');
        return false;
    }
    // Valid
  return true;
}

// Build Bookmarks DOM
function buildBookmarks(){
    bookmarksContainer.textContent = '';
    bookmarks.forEach((bookmark)=>{
     const {name,url} = bookmark;

    //  Item
    const item = document.createElement('div');
    item.classList.add('item');
    // Close Icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fas','fa-times');
    closeIcon.setAttribute('title', 'Delete Bookmarks');
    closeIcon.setAttribute('onclick', `deleteBookmark(${url})`);

    // Favicon/Link container
    const linkInfo = document.createElement('div');
    linkInfo.classList.add('name');

    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute('alt', 'Favicon');

    // Link
    const link = document.createElement('a');
    link.setAttribute('href', `${url}`);
    link.setAttribute('target','_blank');
    link.textContent = name;

    // Add to Bookmark container
    linkInfo.append(favicon,link); // Using append instead of append child as it allows to appends multiple dom nodes at a time
    item.append(closeIcon,linkInfo);
    bookmarksContainer.appendChild(item);
    });
}
// Fetch Bookmarks
function fetchBookmarks(){
    // Get data from local storage if available
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    } 
    buildBookmarks();
}


// Delete Bookmark
function deleteBookmark(url){
    console.log("delete bookmark");
    bookmarks.forEach((bookmark,index)=>{
    if(bookmark.url === url){
        bookmarks.splice(index,1);
    }
    });

    // Update bookmark array in local storage, re-populate DOM
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
}
// Handle Data from form
function storeBookmark(e){
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://') || !urlValue.includes('https://')){
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)){
        return false;
    }
    const bookmark = {
        name:nameValue,
        url:urlValue
    }
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}
bookmarkForm.addEventListener("submit", storeBookmark);

// On Page Load
fetchBookmarks();