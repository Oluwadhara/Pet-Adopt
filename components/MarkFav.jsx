import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Shared from "./../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";

export default function MarkFav({ pet, color='black' }) {
  const { user } = useUser(); // Destructuring user
  const [favList, setFavList] = useState();

  useEffect(() => {
    if (user) {
      GetFav();
    }
  }, [user]);

  const GetFav = async () => {
    try {
      const result = await Shared.GetFavList(user);
      console.log(result); // You should see the result in the console now
      setFavList(result?.favorites ? result?.favorites : []); // Update your state
    } catch (error) {
      console.error("Failed to get favorite list: ", error);
    }
  };

  const AddToFav =async()=>{
    const favResult = favList;
    favResult.push(pet.id)
    await Shared.UpdateFav(user,favResult)
    GetFav();
  };

  const RemoveFromFav=async()=>{
    const favResult = favList.filter(item=>item!=pet.id);
    await Shared.UpdateFav(user,favResult);
    GetFav();
  }

  return (
    <View>
      {favList?.includes(pet.id) ? (
        <Pressable onPress={()=>RemoveFromFav()}>
          <Ionicons name="heart" size={30} color="red" />
        </Pressable>
      ) : (
        <Pressable onPress={()=>AddToFav()}>
          <Ionicons name="heart-outline" size={30} color={color} />
        </Pressable>
      )}
    </View>
  );
}
