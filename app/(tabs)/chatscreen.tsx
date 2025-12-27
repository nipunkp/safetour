import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';
import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View } from 'react-native';
import { db } from '../services/firebase';
import { getChatId } from '../utils/chatid';

export default function ChatScreen() {
  const { userId } = useLocalSearchParams();
  const [me, setMe] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');

  // Load logged-in user
  useEffect(() => {
    AsyncStorage.getItem('user').then(u => {
      if (u) setMe(JSON.parse(u));
    });
  }, []);

  // Listen to messages
  useEffect(() => {
    if (!me || !userId) return;

    const chatId = getChatId(me.id, userId as string);

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt')
    );

    const unsub = onSnapshot(q, snap => {
      setMessages(
        snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return unsub;
  }, [me, userId]);

  const send = async () => {
    if (!text || !me || !userId) return;

    const chatId = getChatId(me.id, userId as string);

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text,
      senderId: me.id,          // 🔥 NOW VALID
      createdAt: serverTimestamp(),
    });

    setText('');
  };

  if (!me) {
    return <Text>Loading user...</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text
            style={{
              alignSelf: item.senderId === me.id ? 'flex-end' : 'flex-start',
              padding: 8,
              backgroundColor:
                item.senderId === me.id ? '#cce5ff' : '#eee',
              marginVertical: 4,
              borderRadius: 6,
            }}>
            {item.text}
          </Text>
        )}
      />

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Message..."
        style={{ borderWidth: 1, padding: 8 }}
      />
      <Button title="Send" onPress={send} />
    </View>
  );
}
