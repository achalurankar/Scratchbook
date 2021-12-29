import { LightningElement, api } from 'lwc';
import { dispatchEvent } from 'c/utils';

export default class Modal extends LightningElement {
    
    @api modalHeader;
    @api fields;

    handleCancelClick(){
        dispatchEvent(this, 'cancel', {});
    }

    handleSaveClick(){
        let updatedFields = [];
        this.fields.forEach(element => {
            let val = this.template.querySelector(`[data-id="${element.uniqueName}"]`).value;
            let temp = Object.assign({}, element);
            temp.value = val;
            updatedFields.push(temp);
        });
        dispatchEvent(this, 'save', { updatedFields : updatedFields });
    }
}