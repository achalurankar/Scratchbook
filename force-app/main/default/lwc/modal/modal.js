import { LightningElement, api } from 'lwc';
import { dispatchEvent } from 'c/utils';

export default class Modal extends LightningElement {
    
    @api modalHeader;
    @api selectedItem;

    handleCancelClick() {
        dispatchEvent(this, 'cancel', {});
    }
    
}