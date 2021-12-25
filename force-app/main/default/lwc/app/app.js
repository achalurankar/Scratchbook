import { LightningElement, api } from 'lwc';
import savePage from '@salesforce/apex/scratchbook_cc.savePage';
import deletePage from '@salesforce/apex/scratchbook_cc.deletePage';

export default class App extends LightningElement {

    @api height;
    @api width;
    @api page;
    bookId = 'a005j0000057CczAAE';
    pageStatus = 'Saved';
    pageStatusClass = 'pageStatus';

    connectedCallback(){
        this.page = {};
        this.height = 490;
        this.width = 1255;
    }

    handleOnSave(event){
        this.page = event.detail.page;
        if(!this.page){
            console.log('received null image');
        }
        var params = {};
        params.bookId = this.bookId;
        params.imageData = this.page.imageData;
        if(this.page.pageId)
            params.pageId = this.page.pageId; 
        else
            params.pageId = '';
        // console.log(JSON.stringify(this.page));
        savePage({ requestStructure : JSON.stringify(params)})
            .then(result => {
                this.updateUi();
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

    handleImageDelete(event){
        var page = event.detail.page;
        deletePage({ pageId : page.pageId })
            .then(result => {
                console.log('deletePage result - ' + result);
                this.template.querySelector('c-sidebar').refreshPages();
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }

    handlePageChange(event){
        this.pageStatus = 'Unsaved';
    }

    updateUi(){
        this.pageStatus = 'Saved';
    }
}