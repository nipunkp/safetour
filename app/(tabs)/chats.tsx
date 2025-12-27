import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import API from '../api';

export default function NearbyUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [myId, setMyId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadNearby = async () => {
      // 1️⃣ Get logged-in user
      const storedUser = await AsyncStorage.getItem('user');
      if (!storedUser) return;

      const me = JSON.parse(storedUser);
      setMyId(me.id);

      // 2️⃣ Get location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});

      // 3️⃣ Fetch nearby users
      const res = await API.get('/api/users/nearby', {
        params: {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        },
      });

      // 4️⃣ ❌ REMOVE SELF FROM LIST
      const filteredUsers = res.data.filter(
        (u: any) => u._id !== me.id
      );

      setUsers(filteredUsers);
    };

    loadNearby();
  }, []);

  return (
    <FlatList
      data={users}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/(tabs)/chatscreen',
              params: { userId: item._id, name: item.name },
            })
          }
        >
          <View
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderColor: '#ddd',
            }}
          >
            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
              {item.name}
            </Text>
            <Text style={{ color: 'gray' }}>Tap to chat</Text>
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <Text style={{ textAlign: 'center', marginTop: 40 }}>
          No nearby tourists found
        </Text>
      }
    />
  );
}
