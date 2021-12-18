({
	saveImage : function(component, data, recordId) {
		var action = component.get("c.savePicture");
        action.setParams({ 'imageData' : data, 'recordId' : recordId });
        action.setCallback(this, function(result){
            var state = result.getState();
            console.log("state = " + state + " returnVal = " + result.getReturnValue());
        });
        $A.enqueueAction(action);
	}
})