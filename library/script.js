let myLibrary = [];


const container = document.querySelector('#books-container');
const form = document.querySelector('.form-container');
const closeButton = document.querySelector('#close');
const newBookButton = document.querySelector('#new-book');
const popupForm = document.querySelector('.popup');


function Book({title, author, pages, read = false}) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.index = null;
    this.info = function() {
        return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read ? 'read' : 'not read yet'}.`;
    }
    this.toggleRead = function() {
        this.read = !this.read;
    }
}

function addBookToLibrary(bookContents) {
    const book = new Book(bookContents);
    myLibrary.push(book);
}

function createDomElement(htmlTag, textContent = '', cls = '') {
    const element = document.createElement(htmlTag);
    if (textContent) {
        element.textContent = textContent;
    }
    if (cls) {
        element.classList.add(cls);
    }

    return element;
}

function removeChildren(parent) {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
}


function displayBooks() {
        // refresh, inefficient
        removeChildren(container);

        myLibrary.forEach((book, index) => {
            const article = createDomElement('article');
            article.dataset.index = index;
            const header = createDomElement('h2', book.title);
        
            const detailsContainer = createDomElement('div');
            detailsContainer.classList.add('details');
            const author = createDomElement('p', `by ${book.author}`);
            const pages = createDomElement('p', `${book.pages} pages`);
            const read = createDomElement('p', `${book.read ? 'Read' : 'Not read yet'}`);
            detailsContainer.append(author, pages, read);
        
            const iconContainer = createDomElement('div', '', 'icons');
            const deleteButton = createDomElement('button');
            const deleteIcon = createDomElement('span', 'delete', 'material-symbols-outlined');
            deleteButton.appendChild(deleteIcon);
        
            const readButton = createDomElement('button');
            const readIcon = createDomElement('span', 'check_box', 'material-symbols-outlined');
            readButton.appendChild(readIcon);
            
            iconContainer.append(deleteButton, readButton);
        
            article.append(header, detailsContainer, iconContainer);
            container.appendChild(article);

            deleteButton.addEventListener('click', function(){
                myLibrary.splice(index, 1);
                const element = document.querySelector(`[data-index="${index}"]`);
                element.remove();
            });

            readButton.addEventListener('click', function(){
                const book = myLibrary[index];
                book.toggleRead();
                const element = document.querySelector(`[data-index="${index}"] .details`);
                element.lastChild.textContent = `${book.read ? 'Read' : 'Not yet read'}`
            })
        });
}


function togglePopup() {
    container.classList.toggle('low-opacity');
    popupForm.classList.toggle('show-popup');
}

form.addEventListener('submit', event => {
    event.preventDefault();

    const inputs = Array.from(document.querySelectorAll('.form-container input'));
    // const selectedRadio = Array.from(document.querySelector('input[name="isRead"]:checked'));
    const allInputs = inputs.reduce((acc, input) => {
       if (input.type === 'radio') {
           if (!input.checked) {
                return acc;
           } 
       }
        return {...acc, [input.id]: input.value}
    }, {});
    
    addBookToLibrary(allInputs);

    displayBooks();

    togglePopup();

})

newBookButton.addEventListener('click', togglePopup);
closeButton.addEventListener('click', togglePopup);


