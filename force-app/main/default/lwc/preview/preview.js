import { LightningElement, api } from 'lwc';

export default class Preview extends LightningElement {
    @api
    page;

    handleClick(){
        var event = new CustomEvent('imageselect', { 
            detail : { 
                page : this.page 
            } 
        });
        this.dispatchEvent(event);
    }
}