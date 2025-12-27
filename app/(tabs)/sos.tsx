import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import API from '../api';


  export default function SosScreen() {
    const [user, setUser] = useState<{ name: string; age: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState<string | null>(null);
    useEffect(() => {
      const loadUser = async () => {
        const storedUser = await AsyncStorage.getItem('user');
        console.log('stored user',storedUser)
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      };
    
      loadUser();
    }, []);
    
    const sendSOS = async () => {
      if (!type) {
        Alert.alert('Select Emergency Type', 'Please choose an emergency type');
        return;
      }
  
      setLoading(true);
  
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location permission is needed for SOS');
        setLoading(false);
        return;
      }
  
      const loc: Location.LocationObject =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      console.log('SOS TYPE:', type);
      console.log('SOS LOCATION:', loc.coords);
      await API.post('/api/sos', {
        name:user?.name,
        age:user?.age,
        emergencyType: type,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLoading(false);
      Alert.alert(
        'SOS Sent',
        `Emergency Type: ${type}\nYour location has been shared`
      );
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🚨 SOS Emergency</Text>
        {!type&&(
        <View style={styles.buttons}>
          <Button title="Medical" onPress={() => setType('Medical')} />
          <Button title="Accident" onPress={() => setType('Accident')} />
          <Button title="Crime" onPress={() => setType('Crime')} />
        </View>
        )}
        <Text style={styles.selected}>
          Selected: {type ?? 'None'}
        </Text>
        {type && (
            <Button
            title="Change Emergency Type"
            onPress={() => setType(null)}
             />
        )}
        {loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : (
          <Button title="SEND SOS" color="red" onPress={sendSOS} />
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: 'red',
    },
    buttons: {
      marginBottom: 15,
    },
    selected: {
      textAlign: 'center',
      marginBottom: 15,
      fontWeight: 'bold',
    },
  });