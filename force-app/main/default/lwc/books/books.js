import { LightningElement, track, api } from 'lwc';

import getBooks from '@salesforce/apex/scratchbook_cc.getBooks';
import { dispatchEvent } from 'c/utils';

export default class Books extends LightningElement {

    @track books;

    connectedCallback() {
        this.loadBooks();
    }

    loadBooks(){
        getBooks()
            .then(result => {
                this.books = result;
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }

    handleBookClick(event){
        let bookId = event.currentTarget.dataset.id;
        dispatchEvent(this, 'bookclick', { bookId : bookId });
    }
}