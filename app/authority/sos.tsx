import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import API from '../api';

type SOS = {
  _id: string;
  name:string;
  age:number;
  emergencyType: string;
  latitude: number;
  longitude: number;
};

export default function AuthoritySOS() {
  const [sosList, setSosList] = useState<SOS[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadSOS();
  }, []);

  const loadSOS = async () => {
    const res = await API.get('/api/sos');
    setSosList(res.data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOS Alerts</Text>

      <FlatList
        data={sosList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/authority/map',
                params: {
                  lat: item.latitude,
                  lng: item.longitude,
                  type: item.emergencyType,
                },
              })
            }
          >
            <Text style={styles.type}>{item.emergencyType}</Text>
            <Text>{item.name}, Age: {item.age}</Text>
            <Text>Tap to view location</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  type: { fontWeight: 'bold' },
});
