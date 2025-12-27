import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import API from '../api';

type AlertItem = {
  _id: string;
  title: string;
  message: string;
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const loadAlerts = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});

      const res = await API.get('/api/alerts', {
        params: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
      });

      setAlerts(res.data);
    };

    loadAlerts();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>🚨 Safety Alerts Nearby</Text>

      {alerts.length === 0 && (
        <Text style={styles.noAlert}>No alerts in your area</Text>
      )}

      {alerts.map((a) => (
        <View key={a._id} style={styles.alertCard}>
          <Text style={styles.alertTitle}>{a.title}</Text>
          <Text style={styles.alertMessage}>{a.message}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop:20,
    textAlign: 'center',
    color: '#b91c1c',
  },
  noAlert: {
    textAlign: 'center',
    color: '#555',
    marginTop: 40,
    fontSize: 16,
  },
  alertCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#dc2626',
    elevation: 2,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#991b1b',
  },
  alertMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
