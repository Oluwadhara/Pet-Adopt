import { View, Text, ScrollView, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import { TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, setDoc, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const {user} = useUser();
  const router=useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);

  const initiateChat = async () => {
    try {
      const docId1 = user?.primaryEmailAddress?.emailAddress + '_' + pet?.email;
      const docId2 = pet?.email + '_' + user?.primaryEmailAddress?.emailAddress;
      
      console.log('User Email:', user?.primaryEmailAddress?.emailAddress);
      console.log('Pet Email:', pet?.email);
  
      const chatDoc1 = await getDoc(doc(db, 'Chat', docId1));
      const chatDoc2 = await getDoc(doc(db, 'Chat', docId2));
  
      console.log('Chat Doc 1 Exists:', chatDoc1.exists());
      console.log('Chat Doc 2 Exists:', chatDoc2.exists());
  
      const sanitizeData = (data) => {
        return Object.keys(data).reduce((acc, key) => {
          if (data[key] !== undefined && data[key] !== null) {
            acc[key] = data[key];
          }
          return acc;
        }, {});
      };
  
      if (!chatDoc1.exists() && !chatDoc2.exists()) {
        const user1 = {
          email: user?.primaryEmailAddress?.emailAddress || '',
          imageUrl: user?.imageUrl || '',
          name: user?.fullName || '',
        };
  
        const user2 = {
          email: pet?.email || '',
          imageUrl: pet?.userImage || '',
          name: pet?.userName || '',
        };
  
        const userIds = [user?.primaryEmailAddress?.emailAddress || '', pet?.email || ''];
  
        console.log('Sanitized Users:', [sanitizeData(user1), sanitizeData(user2)]);
        console.log('User IDs:', userIds);
  
        await setDoc(doc(db, 'Chat', docId1), {
          id: docId1,
          users: [sanitizeData(user1), sanitizeData(user2)],
          userIds: userIds,
        });
  
        router.push({
          pathname: '/chat',
          params: { id: docId1 },
        });
      } else {
        const chatId = chatDoc1.exists() ? docId1 : docId2;
        console.log('Navigating to chat with id:', chatId);
  
        router.push({
          pathname: '/chat',
          params: { id: chatId },
        });
      }
    } catch (error) {
      console.error("Error initiating chat:", error);
    }
  };  
  
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
        }}
      >
        <PetInfo pet={pet} />
        <PetSubInfo pet={pet} />
        <AboutPet pet={pet} />
        <OwnerInfo pet={pet} />
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={initiateChat} style={styles.adoptBtn}>
          <Text
            style={{
              textAlign: "center",
              fontFamily: "outfit-medium",
              fontSize: 20,
            }}
          >
            Adopt Me
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
  },
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
});
