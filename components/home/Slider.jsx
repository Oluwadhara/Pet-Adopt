import { View, Text, StyleSheet, FlatList, Image, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    GetSliders();
  }, []);

  const GetSliders = async () => {
    try {
      const snapShot = await getDocs(collection(db, "Sliders"));
      const sliders = [];
      snapShot.forEach((doc) => {
        sliders.push(doc.data());
      });
      setSliderList(sliders);
    } catch (error) {
      console.error("Error fetching sliders: ", error);
    }
  };

  return (
    <View 
    style={{
      marginTop: 15,
    }}>
      {sliderList.length === 0 ? (
        <Text style={styles.noDataText}>Loading...</Text>
      ) : (
        <FlatList
          data={sliderList}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.sliderContainer}>
              <Image
                source={{
                  uri: item?.imageUrl || "https://example.com/default-image.png",
                }}
                style={styles.sliderImage}
              />
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sliderImage: {
    width: Dimensions.get('screen').width*0.9,
    height: Dimensions.get('screen').height*0.2,
    borderRadius: 15,
    marginRight: 15,
  },
  noDataText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "gray",
  },
});
