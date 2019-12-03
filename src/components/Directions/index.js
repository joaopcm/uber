import React from 'react';
import PropTypes from 'prop-types';
import MapViewDirections from 'react-native-maps-directions';

export default function Directions({ destination, origin, onReady }) {
  return (
    <MapViewDirections
      destination={destination}
      origin={origin}
      onReady={onReady}
      apikey="AIzaSyAKyieSYAGLdk100UVdLT5z11EDgJSFmVg"
      strokeWidth={3}
      strokeColor="#222"
    />
  );
}

Directions.propTypes = {
  destination: PropTypes.shape({
    altitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  origin: PropTypes.shape({
    altitude: PropTypes.number,
    longitude: PropTypes.number,
  }).isRequired,
  onReady: PropTypes.func.isRequired,
};
