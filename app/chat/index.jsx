import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { GiftedChat } from 'react-native-gifted-chat';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser(); 
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user && user.primaryEmailAddress) {
      GetUserDetails();
    }

    // Real-time listener for messages
    const unsubscribe = onSnapshot(collection(db, 'Chat', params?.id, 'Messages'), (snapshot) => {
      const messageData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id, // Ensure the unique key is the Firestore document ID
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(), // Handle invalid timestamps
        };
      });
      setMessages(messageData); // Update messages without appending manually
    });

    return () => unsubscribe(); // Clean up listener
  }, [user]); 

  const GetUserDetails = async () => {
    const docRef = doc(db, 'Chat', params?.id);
    const docSnap = await getDoc(docRef);

    const result = docSnap.data();
    const otherUser = result?.users?.filter(
      (item) => item.email !== user?.primaryEmailAddress?.emailAddress
    );

    if (otherUser && otherUser.length > 0) {
      navigation.setOptions({
        headerTitle: otherUser[0]?.name || 'Chat',
      });
    }
  };

  const onSend = async (newMessages = []) => {
    const message = newMessages[0];

    if (!user?.primaryEmailAddress?.emailAddress) {
      console.error('Error: User email is missing.');
      return;
    }

    const messageToSend = {
      text: message.text,
      createdAt: new Date(), // Ensure this is a valid JS Date object
      user: {
        _id: user?.primaryEmailAddress?.emailAddress || 'unknown',
        name: user?.fullName || 'Anonymous',
        avatar: user?.imageUrl || null,
      },
    };

    try {
      // Use Firestore to add the message and rely on Firestore for unique _id
      await addDoc(collection(db, 'Chat', params.id, 'Messages'), messageToSend);
    } catch (error) {
      console.error('Error adding message: ', error);
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: user?.primaryEmailAddress?.emailAddress || 'unknown',
        name: user?.fullName || 'Anonymous',
        avatar: user?.imageUrl || null,
      }}
    />
  );
}
