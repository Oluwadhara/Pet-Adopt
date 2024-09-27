import { View, Text, FlatList, Pressable, StyleSheet, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { query } from "firebase/database";
import { collection, deleteDoc, doc, getDocs, where } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../../config/FirebaseConfig";
import PetListItem from "../../components/home/PetListItem";
import Colors from "../../constants/Colors";

export default function UserPost() {
  const navigation = useNavigation();
  const { user } = useUser();
  const [userPostList, setUserPostList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "User Post",
    });

    user && GetUserPost();
  }, [user]);

  const GetUserPost = async () => {
    setLoader(true);
  
    // Reset the userPostList to an empty array before fetching new data
    setUserPostList([]);
  
    const q = query(
      collection(db, "Pets"),
      where("email", "==", user?.primaryEmailAddress?.emailAddress)
    );
    const querySnapshot = await getDocs(q);
  
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push(doc.data());
    });
  
    // Update the state with the new list of posts
    setUserPostList(posts);
    setLoader(false);
  };
  

  const onDeletePost=(docId)=>{
    // console.log('Post Deleted Successfully');
    Alert.alert('Delete Post','Are you sure you want to delete this post?',[
        {
            text: 'Cancel',
            onPress:()=>console.log("Cancel clicked"),
            style: 'cancel'
        },
        {
            text: 'Delete',
            onPress:()=>deletePost(docId),
            style: 'default'
        }
    ])
  }

  const deletePost=async(docId)=>{
    await deleteDoc(doc(db,'Pets',docId));
    GetUserPost();
  }

  return (
    <View
      style={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 30,
        }}
      >
        User Post
      </Text>
      <FlatList
        data={userPostList}
        numColumns={2}
        refreshing={loader}
        onRefresh={GetUserPost}
        renderItem={({ item, index }) => (
          <View>
            <PetListItem pet={item} key={index} />
            <Pressable onPress={()=>onDeletePost(item?.id)} style={styles.deleteButton}>
                <Text style={{
                    fontFamily: 'outfit',
                    textAlign: 'center',
                }}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
      {userPostList?.length==0 && <Text>You haven't made any post yet.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 5,
    borderRadius: 7,
    marginTop: 5,
    marginRight: 10,
    marginBottom: 10,
  },
})
