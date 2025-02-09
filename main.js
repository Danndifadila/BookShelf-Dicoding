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
function listBooks(booksObject) {
  const titleBooks = document.createElement("h3");
  titleBooks.setAttribute("data-testid", "bookItemTitle");
  titleBooks.innerText = `Judul ${booksObject.title}`;

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
  if (booksObject.isCompleted) {
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

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

// Make uncompleted button
function markAsUncompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
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
    if (!bookItem.isCompleted) unreadBooks.append(bookElement);
    else readBooks.append(bookElement);
  }
});
