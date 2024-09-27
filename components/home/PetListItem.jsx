import { View, Text, Image, Dimensions } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import MarkFav from "./../MarkFav"

export default function PetListItem({ pet }) {
  const router = useRouter();
  return (
    <TouchableOpacity
    onPress={()=>{router.push({
      pathname: '/pet-details',
      params: pet
    })}}
      style={{
        padding: 10,
        marginRight: 15,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
      }}
    >
      <View style={{
        position: "absolute",
        zIndex: 10,
        right: 10,
        top: 10,
      }}>
        <MarkFav pet={pet} color={'white'}/>
      </View>
      <Image
        source={{ uri: pet?.imageUrl }}
        style={{
          width: Dimensions.get("screen").width * 0.38,
          height: Dimensions.get("screen").height * 0.1,
          resizeMode: "cover",
          borderRadius: 10,
        }}
      />
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 18,
        }}
      >
        {pet?.name}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: Colors.GRAY,
            fontFamily: "outfit",
          }}
        >
          {pet?.breed}
        </Text>
        <Text style={{
            fontFamily: 'outfit',
            color: Colors.PRIMARY,
            paddingHorizontal: 5,
            borderRadius: 10,
            fontSize: 11,
            backgroundColor: Colors.LIGHT_PRIMARY,
        }}>{pet?.age} Yrs</Text>
      </View>
    </TouchableOpacity>
  );
}
