({
	handleChange : function(component, event, helper) {
		var vcl = component.get('v.valueChangeListener');
        var input = component.find("input").getElement();
        var msg = input.value;
        //callback triggerd from child
        vcl.onEvent(msg);
	}
})