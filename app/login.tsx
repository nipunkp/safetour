import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import API from './api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const login = async () => {
    try {
      // 1️⃣ Ask location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Location is needed to continue');
        return;
      }

      // 2️⃣ Get current location
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // 3️⃣ Send login request WITH location
      const res = await API.post('/api/login', {
        email,
        password,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      console.log('login response', res.data);

      // 4️⃣ Store user info + token
      await AsyncStorage.setItem(
        'user',
        JSON.stringify({
          id:res.data.id,
          name: res.data.name,
          age: res.data.age,
          role: res.data.role,
          token: res.data.token,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        })
      );

      // 5️⃣ Route based on role
      if (res.data.role === 'authority') {
        router.replace('/authority');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      Alert.alert('Login failed', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafeTour</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <View style={styles.buttonBox}>
        <Button title="Login" onPress={login} />
      </View>

      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1e3a8a',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 25,
    color: '#555',
  },
  input: {
    width: '100%',
    maxWidth: 320,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  buttonBox: {
    width: '100%',
    maxWidth: 320,
    marginTop: 5,
  },
  signupText: {
    marginTop: 20,
    fontSize: 14,
    color: '#555',
  },
  signupLink: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
