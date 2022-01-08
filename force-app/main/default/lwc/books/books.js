import { LightningElement, track, api } from 'lwc';

import getBooks from '@salesforce/apex/scratchbook_cc.getBooks';
import saveBook from '@salesforce/apex/scratchbook_cc.saveBook';
import deleteBook from '@salesforce/apex/scratchbook_cc.deleteBook';
import { dispatchEvent } from 'c/utils';

export default class Books extends LightningElement {

    @track books;
    @track showModal; //flag to toggle modal
    idVsBookMap; //map to get book object from its id, mapped in getBooks method
    @track selectedBook;
    fields; //fields required on edit book modal

    connectedCallback() {
        this.loadBooks();
    }

    loadBooks(){
        getBooks()
            .then(result => {
                this.books = result;
                this.idVsBookMap = {};
                //mapping book record with its id
                result.forEach(element => {
                    this.idVsBookMap[`${element.id}`] = element;
                });
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }

    // open selected book in pages component
    handleBookClick(event){
        let bookId = event.currentTarget.dataset.id;
        let book = this.idVsBookMap[`${bookId}`];
        dispatchEvent(this, 'bookclick', { book : book });
    }

    //hide modal by setting flag to false
    hideModal(){
        this.showModal = false;
    }

    //new book creation
    handleNewBookClick(){
        this.fields = this.getFields("", "");
        this.showModal = true;
    }

    //edit selected book
    handleEditBookClick(event){
        let bookId = event.currentTarget.dataset.id;
        this.selectedBook = this.idVsBookMap[`${bookId}`];
        this.fields = this.getFields(this.selectedBook.name, this.selectedBook.description);
        // console.log('selectedBook ' + JSON.stringify(this.fields));
        this.showModal = true;
    }
    
    //delete selected book
    handleDeleteBookClick(event){
        let bookId = event.currentTarget.dataset.id;
        deleteBook({ bookId : bookId})
            .then(result => {
                console.log('deleted book with id ' + result);
                this.loadBooks();
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }

    //saving details received from modal component as updatedFields
    handleSave(event){
        let updatedFields = event.detail.updatedFields;
        // console.log(JSON.stringify(updatedFields));
        var params = {};
        params.name = updatedFields[0].value;
        params.description = updatedFields[1].value;
        params.id = this.selectedBook ? this.selectedBook.id : '';
        saveBook({ requestStructure : JSON.stringify(params) })
            .then(result => {
                console.log('book saved with id ' + result);
                this.showModal = false;
                this.selectedBook = undefined;
                this.loadBooks();
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
        
    }

    //get fields array for modal rendering
    getFields(name, description) {
        return [
            { label : "Book Name", value : name, uniqueName : "BookName", required : true }, 
            { label : "Description", value : description, uniqueName : "Description", required : false }
        ];
    }
} 