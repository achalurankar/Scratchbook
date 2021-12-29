import { LightningElement, api, track } from 'lwc';

export default class App extends LightningElement {

    //flag for rendering templates true for books template and false for page template
    @track primary = true;
    @track bookId;

    handleBookClick(event) {
        this.bookId = event.detail.bookId;
        this.primary = false;
    }

    handleExitPages() {
        this.primary = true;
    }
}