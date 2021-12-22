({
	handleOnSave : function(component, event, helper) {
        var page = event.getParam('page');
        var data = page.Data__c;
        data = data.replace(/^data:image\/(png|jpg);base64,/, "");
        console.log(data);
        helper.saveImage(component, data, '0015j00000B4seVAAR'); // account id
	}
})