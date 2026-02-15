import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import API, { BASE_URL } from '../api';
import { createCommunityStyles } from '../styles/communitystyles';
import { DarkColors, LightColors } from '../theme/colors';


type Post = {
  _id: string;
  user: string;
  message: string;
  media?: string | null;
  createdAt?: string;
};

/* ---------- IMAGE UPLOAD FUNCTION ---------- */
const uploadImage = async (uri: string) => {
  const formData = new FormData();

  formData.append('image', {
    uri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  } as any);

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const data = await res.json();
  return data.imageUrl;
};

export default function CommunityScreen() {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? DarkColors : LightColors;
  const styles = createCommunityStyles(colors);

  const [description, setDescription] = useState('');
  const [media, setMedia] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userName, setUserName] = useState<string>('Anonymous');
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserName(user.name);
      }
    };
  
    loadUser();
  }, []);
  

  /* ---------- PICK MEDIA ---------- */
  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images','videos'],
      quality: 1,
    });

    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const uploadedUrl = await uploadImage(localUri);
      setMedia(uploadedUrl); // ✅ PUBLIC URL
    }
  };

  /* ---------- ADD POST ---------- */
  const addPost = async () => {
    if (!description && !media) return;

    try {
      const { status } =
      await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      await API.post('/api/posts', {
        user: userName,
        message: description || 'Shared a media update',
        media,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      setDescription('');
      setMedia(null);
      loadPosts();
    } catch (err) {
      console.log('Post failed');
    }
  };

  /* ---------- LOAD POSTS ---------- */
  const loadPosts = async () => {
    try {
      const { status } =
      await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const loc = await Location.getCurrentPositionAsync({});
      const res = await API.get('/api/posts', {

        params: {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      },
    });
      setPosts(res.data);
    } catch (err) {
      console.log('Failed to load posts');
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👥 Community</Text>

      {/* CREATE POST CARD */}
      <View style={styles.createCard}>
        <TextInput
          placeholder="Share a safety update..."
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />

        {media && (
          <Image
            source={{ uri: media }}
            style={styles.preview}
          />
        )}

        <View style={styles.actions}>
          <TouchableOpacity onPress={pickMedia}>
            <Ionicons
              name="image"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.postButton}
            onPress={addPost}
          >
            <Text style={styles.postText}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* POSTS */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Text style={styles.user}>
              {item.user}
            </Text>

            <Text style={styles.message}>
              {item.message}
            </Text>

            {item.media && (
              <Image
                source={{ uri: item.media }}
                style={styles.postMedia}
              />
            )}

            {item.createdAt && (
              <Text style={styles.time}>
                {new Date(
                  item.createdAt
                ).toLocaleString()}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

/* ---------- STYLES ---------- */
