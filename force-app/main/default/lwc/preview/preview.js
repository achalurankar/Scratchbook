import { LightningElement, api } from 'lwc';

export default class Preview extends LightningElement {
    @api
    page;

    handleClick(){
        this.triggerEventDispatch('imageselect', { page : this.page });
    }

    handleDeleteClick(){
        this.triggerEventDispatch('deleteclick', { page : this.page });
    }
    
    triggerEventDispatch(name, params) {
        var event = new CustomEvent(name, { detail : params });
        this.dispatchEvent(event);
    }
}