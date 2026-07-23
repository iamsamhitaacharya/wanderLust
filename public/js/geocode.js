const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
  provider: 'openstreetmap'
});

module.exports.getCoordinates = async (location, country) => {
  const fallback = [51.505, -0.09]; // default: London

  try {
    const geoData = await geocoder.geocode(`${location}, ${country}`);
    if (geoData.length > 0) {
      return [geoData[0].latitude, geoData[0].longitude];
    }
    return fallback;
  } catch (err) {
    console.log("Geocoding failed:", err.message);
    return fallback;
  }
};