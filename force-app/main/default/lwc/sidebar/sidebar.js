import { LightningElement, api} from 'lwc';

import getPages from '@salesforce/apex/scratchbook_cc.getPages';

export default class Sidebar extends LightningElement {

    @api
    bookId = 'a005j0000057CczAAE';
    pages;

    connectedCallback(){
        this.loadPages();
    }

    /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
    openNav() {
        this.template.querySelector(".sidebar").style.width = "250px";
        this.template.querySelector(".main").style.marginLeft = "250px";
        this.triggerEventDispatch('navigation', { action : 'open' });
    }
    
    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
    closeNav() {
        this.template.querySelector(".sidebar").style.width = "0";
        this.template.querySelector(".main").style.marginLeft = "0";
        this.triggerEventDispatch('navigation', { action : 'close' });
    }

    loadPages(){
        getPages({ bookId : this.bookId })
            .then(result =>{
                this.pages = result;
                // console.log(JSON.stringify(result));
            })
            .catch(error =>{
                console.log(JSON.stringify(error));
            });
    }

    @api
    refreshPages(){
        console.log('into refreshPages');
        this.loadPages();
    }

    handleImageSelect(event){
        var page = event.detail.page;
        this.triggerEventDispatch('imageselected', { page : page });
    }

    handleDeleteClick(){
        
    }
    
    triggerEventDispatch(name, params) {
        var event = new CustomEvent(name, { detail : params });
        this.dispatchEvent(event);
    }
}