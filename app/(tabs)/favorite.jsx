import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import Shared from "../../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore"; // Add 'where' import
import { db } from "../../config/FirebaseConfig";
import PetListItem from "../../components/home/PetListItem";

export default function Favorite() {
  const { user } = useUser();
  const [favIds, setFavIds] = useState([]);
  const [favPetList, setFavPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (user) {
      GetFavPetIds();
    }
  }, [user]);

  // Get Fav Pet IDs
  const GetFavPetIds = async () => {
    setLoader(true);
    try {
      const result = await Shared.GetFavList(user);
      setFavIds(result?.favorites || []); // Ensure favIds is always an array
    } catch (error) {
      console.error("Failed to get favorite pet IDs:", error);
    }
    setLoader(false);
  };

  // Fetch Related Pets once favIds are set
  useEffect(() => {
    if (favIds.length > 0) {
      GetFavPetList();
    } else {
      // Reset the pet list if there are no favIds
      setFavPetList([]);
    }
  }, [favIds]);

  // Fetch related pets from 'Pets' collection
  const GetFavPetList = async () => {
    setLoader(true);
    try {
      setFavPetList([]); // Clear the previous list before fetching new data
      const q = query(collection(db, "Pets"), where("id", "in", favIds));
      const querySnapshot = await getDocs(q);

      const pets = querySnapshot.docs.map((doc) => doc.data()); // Extract pet data
      setFavPetList(pets); // Update state with the new pet list
    } catch (error) {
      console.error("Failed to fetch favorite pets:", error);
    }
    setLoader(false);
  };

  return (
    <View
      style={{
        padding: 20,
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 30,
        }}
      >
        Favorites
      </Text>
      <FlatList
        data={favPetList}
        numColumns={2}
        onRefresh={GetFavPetIds}
        refreshing={loader}
        renderItem={({ item, index }) => (
          <View>
            <PetListItem pet={item} />
          </View>
        )}
        keyExtractor={(item) => item.id} // Add a keyExtractor to avoid warnings
      />
    </View>
  );
}
