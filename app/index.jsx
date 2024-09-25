import { useUser } from "@clerk/clerk-expo";
import { Link, Redirect } from "expo-router";
import { Text, View } from "react-native";
// import { Stack, useRootNavigationState } from "expo-router";

// const rootNavigationState = useRootNavigationState()

// useEffect(()=>{
//   CheckNavLoaded();
// }, [])

// const CheckNavLoaded=()=>{
//   if(!rootNavigationState.key){
//     return null
//   }
// }

export default function Index() {
  const { user } = useUser();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* {user ? <Redirect href={"/(tabs)/home"} /> : <Redirect href={"/login"} />} */}
      <Redirect href={"/(tabs)/home"} />
    </View>
  );
}
