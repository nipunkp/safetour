import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View, useColorScheme, } from 'react-native';
import API from '../api';
import { createChatListStyles } from '../styles/chatstyles';
import { DarkColors, LightColors } from '../theme/colors';

export default function NearbyUsers() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? DarkColors : LightColors;
  const styles = createChatListStyles(colors);
  
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
    <View style={styles.container}>
      <Text style={styles.header}>💬 Nearby Travelers</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/chatscreen',
                params: { userId: item._id },
              })
            }
          >
            <View style={styles.avatar}>
              <Ionicons
                name="person"
                size={20}
                color="#fff"
              />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.name}>
                {item.name}
              </Text>
              <Text style={styles.subtitle}>
                Tap to start chatting
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No nearby tourists found
          </Text>
        }
      />
    </View>
  );
}
