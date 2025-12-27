import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function Dashboard() {
    const router=useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SafeTour Dashboard</Text>

      <View style={styles.button}>
        <Button title="Safety Map" onPress={() => router.push('/(tabs)/maps')} />
      </View>

      <View style={styles.button}>
        <Button title="SOS Emergency" color="red" onPress={() => router.push('/(tabs)/sos')} />
      </View>

      <View style={styles.button}>
        <Button title="Community Feed" onPress={() => router.push('/(tabs)/community')} />
      </View>
      <View style={styles.button}>
        <Button title="Chat" onPress={() => router.push('/(tabs)/chats')} />
      </View>
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
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    marginVertical: 6,
  },
});