var saveBook = () => {
    const bookTitle = document.getElementById('Title').value;
    const bookAuthor = document.getElementById('Author').value;
    const bookPrice = document.getElementById('Price').value;
    const bookSummary = document.getElementById('Summary').value;
    const mail = document.getElementById('AuthorMail').value;
    const phone = document.getElementById('AuthorPhone').value;

    var book = {
        title: bookTitle,
        author: bookAuthor,
        price: bookPrice,
        summary: bookSummary,
        authorMail: mail,
        authorPhone: phone
    }

    if(localStorage.getItem('books') === null)
    {
     let books = [];
     books.push(book);
     localStorage.setItem('books', JSON.stringify(books));
   } else {
     let books = JSON.parse(localStorage.getItem('books'));
     books.push(book);
     localStorage.setItem('books', JSON.stringify(books));
   }
     
}