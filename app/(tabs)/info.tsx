import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View, useColorScheme, } from 'react-native';
import API from '../api';
import { createInfoStyles } from '../styles/infostyles';
import { DarkColors, LightColors } from '../theme/colors';

export default function InfoScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? DarkColors : LightColors;
  const styles = createInfoStyles(colors);
  
  const [weather, setWeather] = useState<any>(null);
  const [city, setCity] = useState('');
  const [guidelines, setGuidelines] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInfo = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      // Weather
      const w = await API.get('/api/info/weather', {
        params: { latitude, longitude },
      });
      setWeather(w.data);

      // Reverse geocode
      const c = await API.get('/api/info/reverse', {
        params: { latitude, longitude },
      });
      setCity(c.data.city);

      // Gemini AI
      const g = await API.get('/api/info/ai-guidelines', {
        params: { city: c.data.city },
      });
      setGuidelines(g.data.guidelines);

      setLoading(false);
    };

    loadInfo();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 100 }} />;
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.header}>📍 {city}</Text>

      {/* WEATHER CARD */}
      {weather && weather.main && weather.weather && (
  <View style={styles.weatherCard}>
    <Ionicons
      name="partly-sunny"
      size={32}
      color="#fff"
    />
    <View>
      <Text style={styles.weatherTemp}>
        {Math.round(weather.main.temp)}°C
      </Text>
      <Text style={styles.weatherDesc}>
        {weather.weather[0].description}
      </Text>
    </View>
  </View>
)}


      {/* AI TIPS */}
      <Text style={styles.sectionTitle}>
        🧠 Travel Tips
      </Text>
      {guidelines
        .split('\n')
        .filter((line) => line.trim() !== '')
        .map((tip, i) => (
        <Text key={i} style={styles.tipItem}>
        • {tip.replace(/^\d+\.\s*/, '')}
        </Text>
        ))}

    </ScrollView>
  );
}
