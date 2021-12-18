({
    //get list of accounts
    getAccounts : function(component) {
        this.triggerApexMethod(component, "GetAccounts", {'city' : component.get('v.selectedCity')}, function(data) {
            if(data != null){
                component.set('v.accounts', data);
            }
        });
    },
    
    //show location for an account
    showLocationForAccount : function(component, data){
        var locations = [];
        var len = data.length;
        if(len > 1) {
            var shortestDistance = this.getShortestDistance(data);
            component.set('v.shortestDistance', shortestDistance);
        }
        for(var i = 0; i < len; i++) {
            var locationData = {};
            var location = data[i];
            if(location.BillingLatitude) {
                locationData.Longitude = location.BillingLongitude;
                locationData.Latitude = location.BillingLatitude;
            } else {
                locationData.Street = location.BillingStreet;
                locationData.City = location.BillingCity;
                locationData.State = location.BillingState;
            }
            locations.push({
                location: locationData,
                title: location.Name,
                description: location.Description
            });
        }
        component.set('v.mapMarkers', locations);
        component.set('v.showModal', true);
    },
    
    getCityList : function(component){
        this.triggerApexMethod(component, "GetCityList", {}, function(data){
            if(data != null){
                component.set('v.selectedCity', '');
                var headerActions = [];
                headerActions.push({
                    label: 'All',
                    checked: false,
                    name:''
                });
                for(var i = 0; i < data.length; i++){
                    headerActions.push({
                        label: data[i],
                        checked: false,
                        name:data[i]
                    });
                }
                component.set('v.columns', [
                    { label: 'Account Number', fieldName: 'AccountNumber', type: 'text', hideDefaultActions: true},
                    { label: 'Account Name', fieldName: 'name', type: 'text', hideDefaultActions: true },
                    { label: 'City', fieldName: 'BillingCity', type: 'text', hideDefaultActions: true, actions: headerActions },
                    { label: 'Phone', fieldName: 'Phone', type: 'phone', hideDefaultActions: true },
                    { label: 'Location', type: 'button', typeAttributes: { label: 'Show Location', name: 'show_location'}}
                ]);
            }
        });
    },
    
    getShortestDistance : function(selectedRows){
        var len = selectedRows.length;
        var shortest = {};
        shortest.fromCity = "";
        shortest.toCity = "";
        shortest.distance = 41000; // max limit, circumference of earth
        for(var i = 0; i < len; i++){
            for(var j = 0; j < len; j++){
                if(i != j) {
                    var distance = this.getDistance(selectedRows[i].BillingLatitude, selectedRows[i].BillingLongitude, 
                                               selectedRows[j].BillingLatitude, selectedRows[j].BillingLongitude);
                    shortest.distance = Math.min(distance, shortest.distance);
                    if(shortest.distance == distance){
                        shortest.fromCity = selectedRows[i].Name;
                        shortest.toCity = selectedRows[j].Name;
                    }
                }
            }
        }
        return shortest;
    },
    
    //get distance between 2 location
    getDistance : function(lat1, lon1, lat2, lon2){
        var p = 0.017453292519943295;    // Math.PI / 180
        var c = Math.cos;
        var a = 0.5 - c((lat2 - lat1) * p)/2 + 
            c(lat1 * p) * c(lat2 * p) * 
            (1 - c((lon2 - lon1) * p))/2;
        var d = 12742 * Math.asin(Math.sqrt(a))
        return d.toFixed(2); // 2 * R; R = 6371 km
    },
    
    //trigger any apex method
    triggerApexMethod : function(component, method, params, callback){
        var action = component.get("c." + method);
        action.setParams(params);
        action.setCallback(this, function(result){
            var state = result.getState();
            if(state === "SUCCESS"){
                callback.call(this, result.getReturnValue());
            } else {
                callback.call(this, null);
            }
        });
        $A.enqueueAction(action);
    }
})