// Book Class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

}

// UI Class
class UI {

    static displayBooks() {
        const books = Store.getBooks();
        // loop through books and add to UI
        books.forEach( (book) => UI.addBookToList(book) );
    }


    static addBookToList(book) {

        // take in a book, create html and add it to the DOM
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href='#' class='btn btn-danger btn-sm delete' > x </a></td>
        `;
        list.appendChild(row);
    }


    static deleteBook(el) {
        // check if user clicked on delete button and if so, delete element from DOM
        if ( el.classList.contains('delete') ) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        // create alert element and insert in the DOM
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // make alert disappear after .3s
        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    static clearFields() {
        // select input elements and set values to empty string
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

} // -- end of UI class --



// Store Class
class Store {

    static getBooks() {
        let books;
        // check local storage for books
        // if no books, create an empty array to store books
        // else if books exist, parse the array and return
        if( localStorage.getItem('books') === null ) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBooks(book) {
        // get books from local storage
        // add new book to books
        // save to localStorage
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        // get books from local storage
        // find book that matches isbn and remove from array
        // save array to local storage
        const books = Store.getBooks();
        books.forEach( (book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
            localStorage.setItem('books', JSON.stringify(books));
        } );

    }


}



// Events
    // display book
    document.addEventListener('DOMContentLoaded', UI.displayBooks);

    // add book
    document.querySelector('#book-form').addEventListener('submit', (e) => {
        e.preventDefault();

        // get form values
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const isbn = document.querySelector('#isbn').value;

        // validate
        if ( title === '' || author === '' || isbn === '' ) {
            UI.showAlert('Please fill in all fields', 'danger');
        } else {
         // construct a book
        const book = new Book(title, author, isbn);

        // add to booklist UI
        UI.addBookToList(book);

        // add book to storage
        Store.addBooks(book);

        // show success msg
        UI.showAlert('Book added', 'success');

        // clear form
        UI.clearFields();   
        }

        
    });

    // remove a book
    document.querySelector('#book-list').addEventListener('click', (e) => {
        // remove from UI
        UI.deleteBook(e.target);
        // remove from storage
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
        // show success msg
        UI.showAlert('Book deleted', 'success');
    });
