/**
 * Saves details of a book to local storage.
 * @param {*} event 
 */
let saveBook = (event) => {
  const bookTitle = document.getElementById('title').value;
  const bookAuthor = document.getElementById('author').value;
  const bookPrice = document.getElementById('price').value;
  const bookSummary = document.getElementById('summary').value;
  const mail = document.getElementById('authorMail').value;
  const phone = document.getElementById('authorPhone').value;
  //Regular Expression - E mail
  const emailPattern = '(.+)@(.+){2,}\.(.+){2,}';
  const emailRegex = RegExp(emailPattern);
  //Regular Expression - Phone Number
  const phonePattern = '[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}';
  const phoneRegex = RegExp(phonePattern);
  //Regular Expression - Book Price
  const pricePattern = '[0-9]';
  const priceRegex = RegExp(pricePattern);

  if (bookTitle.length == 0) {
    alert("Hey.. You forgot to name me..!");
    event.preventDefault();
    return;
  }
  if (bookAuthor.length == 0) {
    alert("Who created me ?");
    event.preventDefault();
    return;
  }
  if (!priceRegex.test(bookPrice) && bookPrice.length > 0) {
    alert("Please Enter the numeric price..!");
    event.preventDefault();
    return;
  }
  if (!emailRegex.test(mail) && mail.length > 0) {
    alert("Please enter a valid email address..!");
    event.preventDefault();
    return;
  }
  if (!phoneRegex.test(phone) && phone.length > 0) {
    alert("Please enter a valid phone number..!");
    event.preventDefault();
    return;
  }

  var book = {
    title: bookTitle,
    author: bookAuthor,
    price: bookPrice.toLocaleString(),
    summary: bookSummary,
    authorMail: mail,
    authorPhone: phone
  }

  if (localStorage.getItem('books') === null) {
    let books = [];
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  } else {
    let books = JSON.parse(localStorage.getItem('books'));
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
}

/**
 * Fetches the entire list of books from local storage.
 * @param {*} event 
 */
let getBookList = (event) => {
  const books = JSON.parse(localStorage.getItem('books'));
  let bookList = document.getElementById('bookList');
  let dataSet = [];
  let bookInList = {
    title: '',
    author: '',
    price: '',
    authorMail: '',
    authorPhone: ''
  }

  if (books) {
    books.forEach(element => {
      Object.assign(bookInList, element);
      dataSet.push(Object.values(bookInList));
    });

    $(document).ready(() => {
      $('#book-table').DataTable({
        data: dataSet,
        columns: [
          { title: "Title" },
          { title: "Author" },
          { title: "Price" },
          { title: "Author Email" },
          { title: "Author Phone" }
        ]
      });
    });
  }
}
/**
 * Hides "Show added books" button if there are no entries.
 */
let bookListButtonVisibility = () => {
  const books = JSON.parse(localStorage.getItem('books'));
  if (!books) {
    document.getElementById("showListButton").style.visibility = "hidden";
  }
}
