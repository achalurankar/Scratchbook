({
    init: function (cmp, event, helper) {
        cmp.set('v.mapMarkers', [
            {
                location: {
                    City: 'San Francisco',
                    Country: 'USA',
                    PostalCode: '94105',
                    State: 'CA',
                    Street: '500 Howard St',
                },
                type: 'Rectangle',
                bounds: {
                    north: 37.788,
                    south: 37.774,
                    east: -122.395,
                    west: -122.412,
                }, 
                strokeColor: '#0b5411', 
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#0b5411', 
                fillOpacity: 0.35,
            },
        ]);
    }
})