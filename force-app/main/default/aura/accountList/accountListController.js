({
    doInit : function(component, event, helper) {
        helper.getAccounts(component);
        helper.getCityList(component);
    },
    
    handleRowAction : function(component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        switch(action.name){
            case 'show_location':
                var locations = [];
                locations.push(row);
                helper.showLocationForAccount(component, locations);
                break;
            default:
                break;
        }
    },
    
    handleHeaderAction : function(component, event, helper){
        var action = event.getParam('action');
        component.set('v.selectedCity', action.name);
        helper.getAccounts(component);
    },
    
    handleRowSelection : function(component, event, helper){
        var selectedRows = event.getParam('selectedRows');
        if(selectedRows.length > 1){
            component.set('v.isRowSelected', true);
        } else {
            component.set('v.isRowSelected', false);
        }
        component.set('v.selectedRows', selectedRows);
    },
    
    handleMultipleClick : function(component, event, helper){
        helper.showLocationForAccount(component, component.get('v.selectedRows'));
    },
    
    hideLocation : function(component, event, helper){
        component.set('v.showModal', false);
    }
})