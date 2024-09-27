import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Header from "../../components/home/Header";
import Slider from "../../components/home/Slider";
import PetListByCategory from "../../components/home/PetListByCategory";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from "../../constants/Colors";
import { TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function home() {
  return (
    <View
      style={{
        padding: 20,
        marginTop: 20,
      }}
    >
      <Header />
      <Slider />
      <PetListByCategory />
      <Link href={'/add-new-pet'} style={styles?.addNewPetContainer}>
      <MaterialIcons name="pets" size={24} color={Colors.PRIMARY} />

        <Text
        style={{
          fontFamily: 'outfit-medium',
          color: Colors.PRIMARY,
          fontSize: 18,
        }}>Add New Pet</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  addNewPetContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
    marginTop: 20,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
    borderRadius: 15,
    borderStyle: 'dashed',
    justifyContent: 'center'
  }
})
