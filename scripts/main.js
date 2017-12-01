const addModal = document.getElementById('addBookModal');
// Get the button that opens the modal
const addBtn = document.getElementById("addBookBtn");
// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
addBtn.onclick = () => {
  document.getElementById('editBookHeader').style.display = 'none';
  document.getElementById('addBookHeader').style.display = 'block';
  document.getElementById('addBtn').style.display = 'block';
  document.getElementById('editBtn').style.display = 'none';
  addModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = () => {
  addModal.style.display = "none";
  document.getElementById('addBookForm').reset();

}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == addModal) {
    addModal.style.display = "none";
    document.getElementById('addBookForm').reset();

  }
}
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
  const date = new Date();
  //validates details.
  const isValid = validateBookDetails(bookTitle, bookAuthor, bookPrice, mail, phone);
  if (isValid) {
    var book = {
      id: date.getTime(),
      title: bookTitle,
      author: bookAuthor,
      price: bookPrice,
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
    localStorage.setItem('isAdded', JSON.stringify(true));
  }
}
/**
 * Fetches the entire list of books from local storage.
 * @param {*} event 
 */
let getBookList = (event) => {
  const books = JSON.parse(localStorage.getItem('books'));
  let bookList = [];
  let bookInList = {
    title: '',
    author: '',
    price: '',
    authorMail: '',
    authorPhone: ''
  }
  let listLabels = { ...bookInList };
  if (books) {
    books.forEach(element => {
      //Formats price value to international format.
      element.price = element.price ? '$' + Number.parseInt(element.price).toLocaleString() : '-';
      if (!element.authorMail.length) {
        element.authorMail = 'nil';
      }
      if (!element.authorPhone.length) {
        element.authorPhone = '-';
      }
      Object.assign(bookInList, element);
      bookList.push(Object.values(bookInList));
    });

    $.getJSON('/resources/bookMetadata.json', (label) => {
      listLabels.title = label.TITLE.label;
      listLabels.author = label.AUTHOR.label;
      listLabels.price = label.PRICE.label;
      listLabels.authorMail = label.AUTHOR_EMAIL.label;
      listLabels.authorPhone = label.AUTHOR_PHONE.label;
      $(document).ready(() => {
        const table = $('#book-table').DataTable({
          data: bookList,
          columns: [
            { title: listLabels.title },
            { title: listLabels.author },
            { title: listLabels.price },
            { title: listLabels.authorMail },
            { title: listLabels.authorPhone },
          ],
          "columnDefs": [
            { className: "dt-body-right", "targets": [2, 4] }
          ]
        });
        $('#book-table tbody').on('click', 'tr', function () {
          var data = table.row(this).data();
          document.getElementById('title').value = data[0];
          document.getElementById('author').value = data[1];
          document.getElementById('price').value = data[2] === '-' ? '' : data[2].slice(1);
          document.getElementById('summary').value = data[6];
          document.getElementById('authorMail').value = data[3] === 'nil' ? '' : data[3];
          document.getElementById('authorPhone').value = data[4] === '-' ? '' : data[4];
          document.getElementById('bookId').value = data[5];
          document.getElementById('addBtn').style.display = 'none';
          document.getElementById('editBtn').style.display = 'inline-block';
          document.getElementById('editBookHeader').style.display = 'block';
          document.getElementById('addBookHeader').style.display = 'none';
          addModal.style.display = "block";
        });
      });
    });
  }
  else {
    $('#book-table').append(
      '<div>Hi, your books will get listed here once you add them. Have a good day..!! </div>'
    );
  }
}
/**
 * Updates book.
 */
let updateBook = () => {
  const books = JSON.parse(localStorage.getItem('books'));
  const bookTitle = document.getElementById('title').value;
  const bookAuthor = document.getElementById('author').value;
  const bookPrice = document.getElementById('price').value;
  const bookSummary = document.getElementById('summary').value;
  const mail = document.getElementById('authorMail').value;
  const phone = document.getElementById('authorPhone').value;
  //validates details.
  const isValid = validateBookDetails(bookTitle, bookAuthor, bookPrice, mail, phone);
  if (isValid && books) {
    const id = document.getElementById('bookId').value;
    books.map((book) => {
      if (book.id == id) {
        book.title = bookTitle;
        book.author = bookAuthor;
        book.price = bookPrice;
        book.summary = bookSummary;
        book.authorMail = mail;
        book.authorPhone = phone;
      }
    });
    localStorage.setItem('books', JSON.stringify(books));
  }
  localStorage.setItem('isAdded', JSON.stringify(true));
}
/**
 * Validates the following parameters.
 * @param {*} bookTitle 
 * @param {*} bookAuthor 
 * @param {*} bookPrice 
 * @param {*} mail 
 * @param {*} phone 
 */
let validateBookDetails = (bookTitle, bookAuthor, bookPrice, mail, phone) => {
  //Regular Expression - E mail
  const emailPattern = '(.+)@(.+){2,}\.(.+){2,}';
  const emailRegex = RegExp(emailPattern);
  //Regular Expression - Phone Number
  const phonePattern = '[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}';
  const phoneRegex = RegExp(phonePattern);
  //Regular Expression - Book Price
  const pricePattern = '[0-9]';
  const priceRegex = RegExp(pricePattern);
  if (bookTitle.length === 0) {
    alert("Hey.. You forgot to name me..!");
    event.preventDefault();
    return false;
  }
  if (bookAuthor.length === 0) {
    alert("Who created me ?");
    event.preventDefault();
    return false;
  }
  if (!priceRegex.test(bookPrice) && bookPrice.length > 0) {
    alert("Please Enter the numeric price..!");
    event.preventDefault();
    return false;
  }
  if (!emailRegex.test(mail) && mail.length > 0) {
    alert("Please enter a valid email address..!");
    event.preventDefault();
    return false;
  }
  if (!phoneRegex.test(phone) && phone.length > 0) {
    alert("Please enter a valid phone number..!");
    event.preventDefault();
    return false;
  }
  return true;
}
/**Shows the success toaster */
let showSuccessToaster = () => {
  let isAdded = JSON.parse(localStorage.getItem('isAdded'));
  if (isAdded) {
    document.getElementById('successToasterLabel').style.visibility = 'visible';
    setTimeout(() => {
      document.getElementById('successToasterLabel').style.visibility = 'hidden';
      localStorage.setItem('isAdded', JSON.stringify(false));
    }, 2000)
  }
}