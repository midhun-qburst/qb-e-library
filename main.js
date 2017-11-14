var saveBook = () => {
    const bookTitle = document.getElementById('title').value;
    const bookAuthor = document.getElementById('author').value;
    const bookPrice = document.getElementById('price').value;
    const bookSummary = document.getElementById('summary').value;
    const mail = document.getElementById('authorMail').value;
    const phone = document.getElementById('authorPhone').value;
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