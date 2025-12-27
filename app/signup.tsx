import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import API from './api';

export default function Signup() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'tourist' | 'authority'>('tourist');
  const router = useRouter();

  const signup = async (selectedRole: 'tourist' | 'authority') => {
    await API.post('/api/signup', {
      name,
      age: Number(age),
      email,
      password,
      role: selectedRole,
    });
    router.replace('/login');
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafeTour</Text>
      <Text style={styles.subtitle}>Create an account</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.buttonBox}>
        <Button
          title="Signup as Tourist"
          onPress={() => {
            signup('tourist');
          }}
        />
      </View>

      <View style={styles.buttonBox}>
        <Button
          title="Signup as Authority"
          color="red"
          onPress={() => {
             signup('authority');
          }}
        />
      </View>

      {/* Back to login */}
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',   // vertical center
    alignItems: 'center',       // horizontal center
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
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  buttonBox: {
    width: '100%',
    maxWidth: 320,
    marginTop: 5,
  },
  loginText: {
    marginTop: 20,
    fontSize: 14,
    color: '#555',
  },
  loginLink: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});
