import { LightningElement, track, api } from 'lwc';

import getBooks from '@salesforce/apex/scratchbook_cc.getBooks';
import { dispatchEvent } from 'c/utils';

export default class Books extends LightningElement {

    @track books;
    @track showModal;
    idVsBookMap;
    @track selectedBook;

    connectedCallback() {
        this.loadBooks();
    }

    loadBooks(){
        getBooks()
            .then(result => {
                this.books = result;
                this.idVsBookMap = {};
                result.forEach(element => {
                    this.idVsBookMap[`${element.id}`] = element;
                });
                // console.log('result ' + JSON.stringify(result));
                // console.log('idVsBookMap ' + JSON.stringify(this.idVsBookMap));
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }

    handleBookClick(event){
        let bookId = event.currentTarget.dataset.id;
        dispatchEvent(this, 'bookclick', { bookId : bookId });
    }

    hideModal(){
        this.showModal = false;
    }

    handleNewBookClick(){
        this.showModal = true;
    }

    handleEditBookClick(event){
        let bookId = event.currentTarget.dataset.id;
        this.selectedBook = this.idVsBookMap[`${bookId}`];
        // console.log('selectedBook ' + JSON.stringify(this.selectedBook));
        this.showModal = true;
    }
} 