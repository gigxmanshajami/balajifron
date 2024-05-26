import { StyleSheet, Text, View, Image, TouchableOpacity, Alert, ActivityIndicator, Vibration, Modal, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { Earth, ChevronRight, MapPin, LogOut } from 'lucide-react-native';
import firebase from '../db/firebase';
import * as Location from 'expo-location';
const UserProfile = ({ navigation }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loc, setLoc] = useState(null);
  const fetchLocation = () => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      if (location) {
        let response = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        })
        response.map((res) => {
          setLoc(res.city);
          console.log(res, "here");
        })
      }
    })();
  }
  const dbLocationSave = () => {
    const uid = firebase.firebase.auth().currentUser.uid;
    // add location to the database of user`
    const usersRef = firebase.firebase.firestore().collection('users');
    const userDoc = usersRef.doc(uid);
    userDoc.update({
      location: loc
    }).then(() => {
      setOpenModal(false);
      console.log('boom baaam');
    }).catch((e) => {
      Alert.alert('Something went wrong');
      console.log(e);
    })

  }
  const fetchProfile = async () => {
    const uid = firebase.firebase.auth().currentUser.uid;
    try {
      const usersRef = firebase.firebase.firestore().collection('users');
      const userDoc = usersRef.doc(uid);
      userDoc.onSnapshot(docSnapshot => {
        // Check if the document exists
        if (docSnapshot.exists) {
          // Get the data from the document
          const userData = docSnapshot.data();

          // Do something with the user data
          console.log("User data:", userData);
          setUserData(userData);
        } else {
          // Handle the case where the document doesn't exist
          console.log("No such document!");
        }
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }
  useEffect(() => {
    fetchProfile();
  }, []);
  firebase.firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
      navigation.push('Login');
    }
  });

  if (!userData) {
    return <View style={{
      flex: 1,
      justifyContent: "center", alignItems: "center"
    }}>
      <ActivityIndicator size={30} color="#000" />
    </View>;
  }
  return (
    <View style={{
      flex: 1,
      backgroundColor: "#fff",
    }}>
      <StatusBar style='auto' />
      <View style={{
        flexDirection: "row",
        justifyContent: "space-evenly",
        paddingTop: 20,
        alignItems: "center",
      }}>
        <View>
          <Image source={{
            uri: userData.image,
          }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              objectFit: "cover",

            }}
          />
        </View>
        <View>
          <Text style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "black",
          }}>
            {userData.fullName}
          </Text>
          <Text style={{
            fontSize: 20,
            fontWeight: "400",
            marginTop: 10,
            color: "black",
          }}>
            {userData.number}
          </Text>
          <TouchableOpacity style={{
            backgroundColor: "black",
            padding: 10,
            borderRadius: 15,
            marginTop: 20,
            alignItems: "center",
            justifyContent: "center",
            width: 150,
            height: 50,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            marginTop: 12,
            marginBottom: 20,
            marginRight: 10,
          }}>
            <Text style={{
              color: "#fff",
              fontWeight: "bold",
            }}>Edit Profile</Text>
          </TouchableOpacity>

        </View>
      </View>
      <View>
        <TouchableOpacity style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 20,
          padding: 10,
        }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center"
          }}>
            <Earth style={{ marginStart: 20 }} size={24} color="black" />
            <Text style={{ marginStart: 20, fontSize: 15, fontWeight: "400", }}>
              Language
            </Text>
          </View>

          <ChevronRight style={{ marginEnd: 20 }} size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.container}>
          <Modal
            visible={openModal}
            statusBarTranslucent={true}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.content}>
              <View style={styles.card}>
                <Text style={styles.title}>Choose Location</Text>
                {/* <Text style={styles.desc}>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Architecto deleniti nemo rerum nulla sint consectetur id esse
                  earum officia cupiditate aperiam, laboriosam repellat sapiente
                  quam, a quisquam mollitia est quasi.
                </Text> */}
                <View>
                  <TextInput style={{
                    borderWidth: 1,
                    borderColor: '#000',
                    padding: 15,
                    borderRadius: 8,
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}
                    value={loc}
                  />
                  {/* <Text>
                    {
                      locations.mocked
                    }
                  </Text> */}
                  <TouchableOpacity
                    onPress={() => dbLocationSave()}
                    style={{
                      padding: 15,
                      borderRadius: 8,
                      backgroundColor: "#000",
                      marginTop: 10,
                    }}>
                    <Text style={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: 20,
                      textAlign: "center",
                    }}>Choose</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      width: "100%",
                      marginTop: 10,
                      backgroundColor: "rgba(0,0,0,0.1)",
                    },
                  ]}
                  onPress={() => setOpenModal(false)}
                >
                  <Text style={[styles.text, { color: "black" }]}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        <TouchableOpacity
          onPress={() => {
            fetchLocation();
            setOpenModal(true)
          }}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            padding: 10,
          }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center"
          }}>
            <MapPin style={{ marginStart: 20 }} size={24} color="black" />
            <Text style={{ marginStart: 20, fontSize: 15, fontWeight: "400", }}>
              Location
            </Text>
          </View>
          <ChevronRight style={{ marginEnd: 20 }} size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Vibration.vibrate(100);
            firebase.firebase.auth().signOut().then(() => {
              Alert.alert(
                "Logged Out",
                "You have been logged out successfully",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      console.log("OK Pressed");
                    },
                  },
                ],
                { cancelable: false }
              );
            }).catch((err) => {
              console.log(err)
            })
          }}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            padding: 10,
          }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center"
          }}>
            <LogOut style={{ marginStart: 20 }} size={24} color="black" />
            <Text style={{ marginStart: 20, fontSize: 15, fontWeight: "400", }}>
              Log Out
            </Text>
          </View>

          <ChevronRight style={{ marginEnd: 20 }} size={24} color="black" />
        </TouchableOpacity>
      </View >
    </View >
  )
}

export default UserProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
  },
  title: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 12,
  },
  card: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  text: {
    fontWeight: "600",
    fontSize: 16,
    color: "white",
  },
  button: {
    width: "90%",
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    height: 56,
    borderRadius: 8,
  },
})