import { LightningElement, api } from 'lwc';
import savePage from '@salesforce/apex/scratchbook_cc.savePage';

export default class App extends LightningElement {

    @api height;
    @api width;
    @api page;
    bookId = 'a005j0000057CczAAE';
    pageStatus = 'Saved';
    pageStatusClass = 'pageStatus';

    connectedCallback(){
        this.page = {};
        this.height = screen.height;
        this.width = screen.width;
    }

    handleOnSave(event){
        this.page = event.detail.page;
        if(!this.page){
            console.log('received null image');
        }
        var params = {};
        params.bookId = this.bookId;
        params.imageData = this.page.Data__c;
        if(this.page.Id)
            params.pageId = this.page.Id;
        savePage({ requestStructure : JSON.stringify(params)})
            .then(result => {
                this.pageStatus = 'Saved';
                console.log('savePage result - ' + result);
                this.template.querySelector('c-sidebar').refreshPages();
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }
    
    handleNavigation(event){
        var action = event.detail.action;
        if(action === 'open'){
            this.template.querySelector('c-board').style.marginLeft = '250px';
            this.template.querySelector('.pageStatus').style.marginLeft = '270px';
        } else {
            this.template.querySelector('.pageStatus').style.marginLeft = '100px';
            this.template.querySelector('c-board').style.marginLeft = '0px';
        }
    }

    handleImageSelected(event){
        var page = event.detail.page;
        this.pageStatus = 'Saved';
        var cmp = this.template.querySelector('c-board');
        cmp.loadImage(page);
    }

    handlePageChange(event){
        this.pageStatus = 'Unsaved';
    }
}