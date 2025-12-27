import * as Location from 'expo-location';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import API from '../api';

export default function Broadcast() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const sendAlert = async () => {
    const loc = await Location.getCurrentPositionAsync({});

    await API.post('/api/alerts', {
      title,
      message,
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      createdBy: 'Authority',
    });

    alert('Alert sent within 20km');
    setTitle('');
    setMessage('');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20 }}>Broadcast Alert</Text>

      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <Button title="Send Alert (20 km)" onPress={sendAlert} />
    </View>
  );
}
