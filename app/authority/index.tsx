import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
export default function AuthorityDashboard() {
const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Authority Dashboard</Text>

      <Button title="View SOS Alerts" onPress={()=> router.push('/authority/sos')}/>
      <Button title="Manage Danger Zones" onPress={()=>router.push('/authority/dangerzone')} />
      <Button title="Send Safety Broadcast" onPress={()=>router.push('/authority/broadcast')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});
