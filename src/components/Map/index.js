import React, { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

import { View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';
import {
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
  Back,
} from './styles';

import { getPixelSize } from '../../utils';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

Geocoder.init('AIzaSyAKyieSYAGLdk100UVdLT5z11EDgJSFmVg');

export default function Map() {
  const [ref, setRef] = useState();
  const [region, setRegion] = useState();
  const [destination, setDestination] = useState(null);
  const [duration, setDuration] = useState(null);
  const [location, setLocation] = useState('');

  function handleLocationSelected(data, { geometry }) {
    const {
      location: { lat: latitude, lng: longitude },
    } = geometry;

    setDestination({
      latitude,
      longitude,
      title: data.structured_formatting.main_text,
    });
  }

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { longitude, latitude } = coords;

        const response = await Geocoder.from({ latitude, longitude });
        const address = response.results[0].formatted_address;
        const locationAddress = address.substring(0, address.indexOf(','));

        setLocation(locationAddress);

        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0143,
          longitudeDelta: 0.0134,
        });
      },
      () => {},
      {
        timeout: 2000,
        enableHighAccuracy: true,
        maximumAge: 1000,
      }
    );
  }, []);

  function handleBack() {
    setDestination(null);
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={element => setRef(element)}
        region={region}
        style={{ flex: 1 }}
        showsUserLocation
        loadingEnabled
      >
        {destination && (
          <>
            <Directions
              origin={region}
              destination={destination}
              onReady={result => {
                setDuration(Math.floor(result.duration));

                ref.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: getPixelSize(50),
                    left: getPixelSize(50),
                    bottom: getPixelSize(350),
                    top: getPixelSize(50),
                  },
                });
              }}
            />
            <Marker
              coordinate={destination}
              anchor={{ x: 0, y: 0 }}
              image={markerImage}
            >
              <LocationBox>
                <LocationText>{destination.title}</LocationText>
              </LocationBox>
            </Marker>

            <Marker coordinate={region} anchor={{ x: 0, y: 0 }}>
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker>
          </>
        )}
      </MapView>

      {destination ? (
        <>
          <Back onPress={handleBack}>
            <Image source={backImage} />
          </Back>
          <Details />
        </>
      ) : (
        <Search onLocationSelected={handleLocationSelected} />
      )}
    </View>
  );
}
