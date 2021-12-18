({
	doInit : function(component, event, helper) {
        var obj = {};
        obj.one = "one value";
        obj.two = "two value";
        component.set('v.wrapper', obj);
        var ret = component.get('v.wrapper');
        console.log(typeof(ret));
        console.log(JSON.stringify(ret));
        console.log(ret.one);
	}
})