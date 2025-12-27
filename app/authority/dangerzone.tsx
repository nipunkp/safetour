import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import API from '../api';

export default function ZoneManager() {
  const [point, setPoint] = useState<any>(null);
  const [type, setType] = useState('crime');
  const [severity, setSeverity] = useState('high');
  const [radius, setRadius] = useState(500);

  const saveZone = async () => {
    if (!point) return;

    await API.post('/api/zones', {
      latitude: point.latitude,
      longitude: point.longitude,
      radius,
      severity,
      type,
    });

    Alert.alert('Danger zone saved');
    setPoint(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Danger Zone</Text>

      <MapView
        style={styles.map}
        onPress={(e) => setPoint(e.nativeEvent.coordinate)}
      >
        {point && (
          <>
            <Marker coordinate={point} />
            <Circle
              center={point}
              radius={radius}
              strokeColor={getColor(severity)}
              fillColor={getFillColor(severity)}
            />
          </>
        )}
      </MapView>

      {/* CONTROLS */}
      <View style={styles.controls}>
        <Text>Danger Type</Text>
        <Picker selectedValue={type} onValueChange={setType}>
          <Picker.Item label="Crime" value="crime" />
          <Picker.Item label="Accident" value="accident" />
          <Picker.Item label="Weather" value="weather" />
        </Picker>

        <Text>Severity</Text>
        <Picker selectedValue={severity} onValueChange={setSeverity}>
          <Picker.Item label="Low" value="low" />
          <Picker.Item label="Medium" value="medium" />
          <Picker.Item label="High" value="high" />
        </Picker>

        <Text>Radius: {radius} m</Text>
        <Slider
          minimumValue={100}
          maximumValue={2000}
          step={100}
          value={radius}
          onValueChange={setRadius}
        />

        {point && <Button title="Save Zone" onPress={saveZone} />}
      </View>
    </View>
  );
}

// 🔴 COLOR BASED ON SEVERITY
const getColor = (severity: string) => {
  if (severity === 'high') return 'red';
  if (severity === 'medium') return 'orange';
  return 'yellow';
};

const getFillColor = (severity: string) => {
  if (severity === 'high') return 'rgba(255,0,0,0.3)';
  if (severity === 'medium') return 'rgba(255,165,0,0.3)';
  return 'rgba(255,255,0,0.3)';
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 18, textAlign: 'center', margin: 10 },
  map: { flex: 1 },
  controls: {
    padding: 10,
    backgroundColor: '#fff',
  },
});
