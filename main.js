const books = [];
const RENDER_EVENT = "render=books";
const EVENT_SAVED = "books-saved";
const KEY_VALUE = "books_key";

// Check if browser support local storage
function storageExisted() {
  if (typeof Storage === undefined) {
    alert("Browser not support local storage");
    return false;
  }
  return true;
}

// Configuration local storage
function saveAction() {
  if (storageExisted()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(KEY_VALUE, parsed);
    document.dispatchEvent(new Event(EVENT_SAVED));
  }
}

// Keep displaying books after reload
function displayDataStorage() {
  const serializedData = localStorage.getItem(KEY_VALUE);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Make submit button not reload the page
document.addEventListener("DOMContentLoaded", function () {
  const submitButton = document.getElementById("bookForm");
  submitButton.addEventListener("submit", function (event) {
    event.preventDefault();
    addBooks();
  });

  if (storageExisted()) {
    displayDataStorage();
  }
});

// Add book to the list
function addBooks() {
  const textBook = document.getElementById("bookFormTitle").value;
  const authorBook = document.getElementById("bookFormAuthor").value;
  const yearBook = parseInt(document.getElementById("bookFormYear").value);
  const checkBox = document.getElementById("bookFormIsComplete").checked;
  const generationID = generateID();
  const booksObject = generateBookObject(
    generationID,
    textBook,
    authorBook,
    yearBook,
    checkBox
  );
  books.push(booksObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveAction();
}

// Generate unique id for each book
function generateID() {
  return +new Date();
}

// Adding books to an object
function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

// Make container in html for books
function listBooks(booksObject) {
  const titleBooks = document.createElement("h3");
  titleBooks.setAttribute("data-testid", "bookItemTitle");
  titleBooks.innerText = `Judul: ${booksObject.title}`;

  const authorBooks = document.createElement("p");
  authorBooks.setAttribute("data-testid", "bookItemAuthor");
  authorBooks.innerText = `Penulis: ${booksObject.author}`;

  const yearBooks = document.createElement("p");
  yearBooks.setAttribute("data-testid", "bookItemYear");
  yearBooks.innerText = `Tahun: ${booksObject.year}`;

  const itemBooksWrapper = document.createElement("div");
  itemBooksWrapper.setAttribute("data-bookid", `${booksObject.id}`);
  itemBooksWrapper.setAttribute("data-testid", "bookItem");
  itemBooksWrapper.append(titleBooks, authorBooks, yearBooks);

  // Add complete button, delet button, edit button, and uncomplete button
  if (booksObject.isComplete) {
    const uncompleteButton = document.createElement("button");
    uncompleteButton.innerText = "Belum Selesai Dibaca";

    uncompleteButton.addEventListener("click", function () {
      markAsUncompleted(booksObject.id);
    });

    // Make delete book button
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.innerText = "Hapus Buku";

    deleteButton.addEventListener("click", function () {
      markBookToDelete(booksObject.id);
    });

    //Make edit book button
    const editButton = document.createElement("button");
    editButton.innerText = "Edit Buku";
    editButton.setAttribute("data-testid", "bookItemEditButton");

    editButton.addEventListener("click", function () {
      bookToEdit(booksObject.id);
    });

    const buttonWrapper = document.createElement("div");
    buttonWrapper.append(uncompleteButton, deleteButton, editButton);

    itemBooksWrapper.append(buttonWrapper);
  } else {
    // Make complete button
    const completeButton = document.createElement("button");
    completeButton.setAttribute("data-testid", "bookItemIsCompleteButton");
    completeButton.innerText = "Selesai Dibaca";

    completeButton.addEventListener("click", function () {
      markBookAsComplete(booksObject.id);
    });

    // Make delete book button
    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.innerText = "Hapus Buku";

    deleteButton.addEventListener("click", function () {
      markBookToDelete(booksObject.id);
    });

    //Make edit book button
    const editButton = document.createElement("button");
    editButton.innerText = "Edit Buku";
    editButton.setAttribute("data-testid", "bookItemEditButton");

    editButton.addEventListener("click", function () {
      bookToEdit(booksObject.id);
    });

    const buttonWrapper = document.createElement("div");
    buttonWrapper.append(completeButton, deleteButton, editButton);

    itemBooksWrapper.append(buttonWrapper);
  }

  return itemBooksWrapper;
}

// Make complete button function
function markBookAsComplete(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveAction();
}

// Make uncompleted button
function markAsUncompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveAction();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// Make delete button function
function markBookToDelete(bookId) {
  const todoTarget = findBookIndex(bookId);

  if (todoTarget === -1) return;

  books.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveAction();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// All button activities
document.addEventListener(RENDER_EVENT, function () {
  const unreadBooks = document.getElementById("incompleteBookList");
  unreadBooks.innerHTML = "";

  const readBooks = document.getElementById("completeBookList");
  readBooks.innerText = "";

  for (const bookItem of books) {
    const bookElement = listBooks(bookItem);
    if (!bookItem.isComplete) unreadBooks.append(bookElement);
    else readBooks.append(bookElement);
  }
});
