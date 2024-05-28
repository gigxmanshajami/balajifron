import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Vibration,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import FoodContainer from "../components/FoodContainer";
import { useNavigation } from "@react-navigation/native";
import firebase from "../db/firebase";
import { StatusBar } from "expo-status-bar";
import ProgressBar from "react-native-animated-progress";

// import database  from "../db/firebase";
const Home = ({ route }) => {
  const navigation = useNavigation();
  const [appStatus, setAppStatus] = useState(true);
  const { uid } = route?.params;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  console.log(uid, "from home");
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    console.log("preloading");

    // Realtime listener for app status changes
    const unsubscribe = firebase.firebase
      .firestore()
      .collection("appmng")
      .doc("MaqCz1bi2a8VLOhSyA51")
      .onSnapshot((doc) => {
        console.log(doc.data().status, "laoded doc");
        setAppStatus(doc.data().status);
      });

    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    if (debouncedQuery !== "" && debouncedQuery !== null) {
      setSearchResults([]);
      setLoading(true);
      firebase.firebase
        .firestore()
        .collection("foods")
        .where("foodName", ">=", debouncedQuery)
        .get()
        .then((data) => {
          setSearchResults(data.docs.map((doc) => doc.data()));
          console.log(searchResults);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setSearchResults([]);
    }
  }, [debouncedQuery]);

  return appStatus === true ? (
    <View style={style.container}>
      {loading && <ProgressBar indeterminate backgroundColor="#000" />}
      <StatusBar style="auto" />
      <View style={style.parnetCon}>
        <Text style={style.textHead}>
          Find The <Text style={{ fontWeight: "800" }}>Best</Text>
          {"\n"}
          <Text style={{ fontWeight: "800" }}>Food</Text> Around You
        </Text>
      </View>
      <View style={style.parnetConTwo}>
        <TextInput
          style={{
            borderColor: "gray",
            borderWidth: 0,
            backgroundColor: "#eee",
            padding: 15,
            paddingLeft: 20,
            borderRadius: 30,
            fontWeight: "bold",
          }}
          onChangeText={setSearchQuery}
          value={searchQuery}
          keyboardType="web-search"
          placeholder="Search your favourite food"
        />
        <FlatList
          data={searchResults}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                Vibration.vibrate(100);
                navigation.navigate("FoodDetail", {
                  item: item,
                });
              }}
              style={{
                margin: 10,
                zIndex: 20,
                padding: 10,
                backgroundColor: "#fff",
                borderRadius: 10,
                borderWidth: 0.9,
              }}
            >
              <Text>{item.foodName}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <FoodContainer />
    </View>
  ) : (
    <View style={{
      alignItems:"center",
      justifyContent:"center",
      flex:1,
    }}>
      <ActivityIndicator size={60} color="black" />
      <StatusBar style="auto" />
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  parnetCon: {
    padding: 20,
  },
  parnetConTwo: {
    padding: 20,
    paddingTop: 10,
  },
  textHead: {
    fontSize: 30,
    color: "#000",
  },
});
export default Home;
