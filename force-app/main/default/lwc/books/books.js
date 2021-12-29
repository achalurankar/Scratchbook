import { LightningElement, track, api } from 'lwc';

import getBooks from '@salesforce/apex/scratchbook_cc.getBooks';
import saveBook from '@salesforce/apex/scratchbook_cc.saveBook';
import { dispatchEvent } from 'c/utils';

export default class Books extends LightningElement {

    @track books;
    @track showModal;
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
        //emptying old values for fields for new book
        this.fields = this.getFields("", "");
        this.showModal = true;
    }

    handleEditBookClick(event){
        let bookId = event.currentTarget.dataset.id;
        this.selectedBook = this.idVsBookMap[`${bookId}`];
        this.fields = this.getFields(this.selectedBook.name, this.selectedBook.description);
        // console.log('selectedBook ' + JSON.stringify(this.fields));
        this.showModal = true;
    }

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