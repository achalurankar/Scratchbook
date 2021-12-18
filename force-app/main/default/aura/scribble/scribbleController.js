({
	handleOnSave : function(component, event, helper) {
        var imageBase64 = event.getParam('image');
        helper.saveImage(component, imageBase64, '0015j00000B4seVAAR'); //eg account id
	}
})