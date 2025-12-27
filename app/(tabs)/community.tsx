import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import API, { BASE_URL } from '../api';


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
      await API.post('/api/posts', {
        user: userName,
        message: description || 'Shared a media update',
        media,
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
      const res = await API.get('/api/posts');
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
      <Text style={styles.title}>Community Feed</Text>

      {/* CREATE POST */}
      <View style={styles.createBox}>
        <TextInput
          placeholder="Share a safety update..."
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />

        {media && (
          <Image source={{ uri: media }} style={styles.preview} />
        )}

        <View style={styles.actions}>
          <Button title="Add Photo/Video" onPress={pickMedia} />
          <Button title="Post" onPress={addPost} />
        </View>
      </View>

      {/* POSTS LIST */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.user}>{item.user}</Text>
            <Text>{item.message}</Text>

            {item.media && (
              <Image source={{ uri: item.media }} style={styles.postMedia} />
            )}

            <Text style={styles.time}>
              {item.createdAt
                ? new Date(item.createdAt).toLocaleString()
                : ''}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  createBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    minHeight: 60,
    marginBottom: 8,
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  user: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
    textAlign: 'right',
  },
  postMedia: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    marginTop: 8,
  },
});
