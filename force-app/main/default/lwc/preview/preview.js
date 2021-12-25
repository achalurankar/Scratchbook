import { LightningElement, api } from 'lwc';
import { dispatchEvent } from 'c/utils';

export default class Preview extends LightningElement {
    @api
    page;

    handleClick(){
        dispatchEvent(this, 'imageselect', { page : this.page });
    }

    handleDeleteClick(){
        dispatchEvent(this, 'deleteclick', { page : this.page });
    }
}