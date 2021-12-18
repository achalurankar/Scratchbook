({
	setValueChangeListener : function(component, event, helper) {
        var callbacks = {
            //functions to call from child
            onEvent : function(msg){
                component.set('v.parentVal', msg);
            }
        };
        component.set('v.valueChangeListener', callbacks);
	}
})