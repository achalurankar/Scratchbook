import { LightningElement, api } from 'lwc';
import { dispatchEvent } from 'c/utils';

// important, do this before making changes in scratchbook
// todo - fetch modal changes from todo-alerts project
// retrieving modal component into that project and making changes for time input

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