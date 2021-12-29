import { LightningElement, api } from 'lwc';
import { dispatchEvent } from 'c/utils';

export default class Modal extends LightningElement {
    
    @api modalHeader;
    @api fields;

    //cancel click to discard changes and fire event to parent component
    handleCancelClick(){
        dispatchEvent(this, 'cancel', {});
    }

    //retrieve edited fields using data-id uniqueName attribute and fire event to parent component
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