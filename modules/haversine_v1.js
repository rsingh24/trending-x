'use strict';

const haversine = require('haversine')

module.exports = {
    getDistanceInMiles: function(startCoordinates, endCoordinates) {
        var distanceInMiles = haversine(start, end, {unit: 'mile'});
        console.log('Distance in Miles :' + distanceInMiles);
        return haversine(start, end, {unit: 'mile'});
    }
};
