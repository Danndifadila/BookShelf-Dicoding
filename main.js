const books = [];
const RENDER_EVENT = "render=books";

// Make submit button not reload the page
document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("bookForm");
  submitButton.addEventListener("submit", function (event) {
    event.preventDefault();
    addBooks();
  });
});

// Add book to the list
function addBooks() {
  const textBook = document.getElementById("bookFormTitle").value;
  const authorBook = document.getElementById("bookFormAuthor").value;
  const yearBook = document.getElementById("bookFormYear").value;
  const generationID = generateID();
  const booksObject = generateBookObject(
    generationID,
    textBook,
    authorBook,
    yearBook,
    false
  );
  books.push(booksObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Generate unique id for each book
function generateID() {
  return +new Date();
}

// Adding books to an object
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

// Make container in html for books
// function listBooks(booksObject) {
//     const titleBooks = document.createElement('h3');
//     titleBooks.innerText = booksObject.title;

//     const authorBooks = document.createElement('p');
//     authorBooks.innerText = booksObject.author;

//     const yearBooks = document.createElement('p');
//     yearBooks.innerText = booksObject.year;

//     const itemContainerBooks = document.createElement('div');
//     itemContainerBooks.classList.add('data-bookid', 'data-testid');
//     itemContainerBooks.append(titleBooks, authorBooks, yearBooks);

//     // Add finish reading, delete books, and edit books
//     if (booksObject.isCompleted) {
//         // Make finish button
//     }
// }

// Make delete book button

// Make finish button function

// Make delete button function

// All button activities
document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
});
