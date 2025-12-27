import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import API from '../api';

export default function MapScreen() {
  const [location, setLocation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [dangerZones, setDangerZones] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);
  useEffect(() => {
    const loadZones = async () => {
      try {
        const res = await API.get('/api/zones');
        setDangerZones(res.data);
      } catch (err) {
        console.log('Failed to load danger zones');
      }
    };
  
    loadZones();
  }, []);
  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }
  
  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Fetching location...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation>
      {dangerZones.map(zone => (
            <Circle
            key={zone.id}
            center={{
                latitude: zone.latitude,
                longitude: zone.longitude,
                    }}
            radius={zone.radius}
            strokeColor="rgba(255,0,0,0.8)"
            fillColor="rgba(255,0,0,0.3)"
  />
))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});