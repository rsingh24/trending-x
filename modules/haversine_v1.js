'use strict';

const haversine = require('haversine')

module.exports = {
    getDistanceInMiles: function(startCoordinates, endCoordinates) {
        var distanceInMiles = haversine(startCoordinates, endCoordinates, {unit: 'mile'});
        console.log('Distance in Miles :' + distanceInMiles);
        return haversine(startCoordinates, endCoordinates, {unit: 'mile'});
    }
};
