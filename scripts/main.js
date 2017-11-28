// Get the modal
const addModal = document.getElementById('addBookModal');

// Get the button that opens the modal
const addBtn = document.getElementById("addBookBtn");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
addBtn.onclick = () => {
  addModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = () => {
  addModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target == addModal) {
      addModal.style.display = "none";
    }
}

/**
 * Saves details of a book to local storage.
 * @param {*} event 
 */
let saveBook = (event) => {
  const bookTitle = document.getElementById('title').value;
  const bookAuthor = document.getElementById('author').value;
  let bookPrice = document.getElementById('price').value;
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
  let listLabels = {...bookInList};
  if (books) {
    books.forEach(element => {
      //Formats price value to international format.
      element.price = element.price ? '$' + Number.parseInt(element.price).toLocaleString() : '-';     
      if(!element.authorMail.length) {
        element.authorMail = 'nil';
      } 
      if(!element.authorPhone.length) {
        element.authorPhone = '-';
      } 
      Object.assign(bookInList, element);
      bookList.push(Object.values(bookInList));
    });

    $.getJSON('../resources/bookMetadata.json',(label) => {
      listLabels.title = label.TITLE;
      listLabels.author = label.AUTHOR;
      listLabels.price = label.PRICE;      
      listLabels.authorMail = label.AUTHOR_EMAIL;
      listLabels.authorPhone = label.AUTHOR_PHONE;     
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
            { className: "dt-body-right", "targets": [ 2,4 ] }
          ]
          
        });
        $('#book-table tbody').on('click', 'tr', function () {
          var data = table.row( this ).data();
          alert( 'You clicked on '+data[0]+'\'s row' );
      } );
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
 * Hides "Show added books" button if there are no entries.
 */
let bookListButtonVisibility = () => {
  const books = JSON.parse(localStorage.getItem('books'));
  if (!books) {
    document.getElementById("showListButton").style.visibility = "hidden";
  }
}
