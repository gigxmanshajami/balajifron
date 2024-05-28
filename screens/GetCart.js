import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Vibration,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import firebase from "../db/firebase";
import Checkbox from "expo-checkbox";

import { Plus, ChevronLeft, Minus } from "lucide-react-native";

const GetCart = ({ navigation }) => {
  const todoRef = firebase.firebase.firestore();
  const [data, setData] = useState([]);
  const userId = firebase.firebase.auth().currentUser.uid;
  const [location, setLocation] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [isUpiChecked, setUpiChecked] = useState(false);
  useEffect(() => {
    setOpenModal(true);
    const unsubscribe = todoRef
      .collection("users")
      .doc(userId)
      .onSnapshot(
        (doc) => {
          if (doc.exists) {
            const cartItems = doc.data().cart;
            const location = doc.data().location;
            setLocation(location);
            // Ensure each cart item has a quantity field
            const updatedCartItems = cartItems.map((item) => ({
              ...item,
              data: {
                ...item.data,
                quantity: item.data.quantity || 1,
              },
            }));
            setData(updatedCartItems);
          } else {
            console.log("User document does not exist");
          }
        },
        (error) => {
          console.error(error);
        }
      );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isUpiChecked === true) {
      setChecked(false);
    }
  }, [isUpiChecked]);
  useEffect(() => {
    if (isChecked === true) {
      setUpiChecked(false);
    }
  }, [isChecked]);
  const updateCartQty = (id, opt) => {
    Vibration.vibrate(100);

    const updatedData =
      data.length > 0 &&
      data.map((item) => {
        if (item.data.id === id) {
          const newQuantity =
            opt === "add" ? item.data.quantity + 1 : item.data.quantity - 1;
          return {
            ...item,
            data: {
              ...item.data,
              quantity: newQuantity > 0 ? newQuantity : 1, // Ensure quantity is never less than 1
            },
          };
        }
        return item;
      });

    setData(updatedData);

    todoRef
      .collection("users")
      .doc(userId)
      .update({
        cart: updatedData,
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  };

  const calculateTotalPrice = () => {
    return data.reduce((total, item) => {
      return total + parseFloat(item.data.foodPrice) * item.data.quantity;
    }, 0);
  };

  //   check for payment
  const payment = async () => {
    const totalPrice = calculateTotalPrice();
    // check for the payment mode
    setOpenModal(true);
    if (isChecked === true) {
      const orderData = {
        userId: userId,
        useraddress: location,
        price: totalPrice,
        paymentMethod: "COD",
        deliverStatus: false,
        orderStatus: false,
        // Add other order details as needed
        foods: data,
      };

      firebase.firebase
        .firestore()
        .collection("orders")
        .add(orderData)
        .then((docRef) => {
          console.log("Order added with ID: ", docRef.id);
          // Perform further actions if needed
          setOpenModal(false);
        })
        .catch((error) => {
          console.error("Error adding order: ", error);
        });
      // cod pauyment
    } else if (isUpiChecked === true) {
      // online payment mode proces
    }
  };

  const renderItem = ({ item }) => (
    <TouchableWithoutFeedback style={styles.childContainer}>
      <View style={styles.cartitem}>
        <TouchableWithoutFeedback
          onPress={() => {
            Vibration.vibrate(100);
            navigation.navigate("FoodDetail", {
              item: item.data,
              uid: userId,
            });
          }}
        >
          <View style={styles.cartImage}>
            <Image
              source={{ uri: item.data.image }}
              style={{ width: 120, height: 120 }}
            />
          </View>
        </TouchableWithoutFeedback>
        <View>
          <Text style={styles.foodName}>{item.data.foodName}</Text>
          <View style={styles.quantityContainer}>
            <Plus
              onPress={() => updateCartQty(item.data.id, "add")}
              color="#fff"
              size={20}
            />
            <Text style={styles.quantityText}>{item.data.quantity}</Text>
            <Minus
              onPress={() => updateCartQty(item.data.id, "sub")}
              color="#fff"
              size={20}
            />
          </View>
        </View>
        <View>
          <Text style={styles.priceText}>₹{item.data.foodPrice}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        visible={openModal}
        statusBarTranslucent={true}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.title}>Please Choose Payment Mode</Text>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  value={isChecked}
                  style={{
                    padding: 9,
                    margin: 10,
                    borderRadius: 4,
                    borderWidth: 2,
                  }}
                  onValueChange={(data) => {
                    Vibration.vibrate(100);
                    setChecked(data);
                  }}
                  color={isChecked ? "#000" : undefined}
                />
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: 20,
                  }}
                >
                  COD
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Checkbox
                  value={isUpiChecked}
                  style={{
                    padding: 9,
                    margin: 10,
                    borderRadius: 4,
                    borderWidth: 2,
                  }}
                  onValueChange={(data) => {
                    Vibration.vibrate(100);
                    setUpiChecked(data);
                  }}
                  color={isUpiChecked ? "#000" : undefined}
                />
                <Text
                  style={{
                    fontWeight: "400",
                    fontSize: 20,
                  }}
                >
                  UPI
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  width: "100%",
                  marginTop: 10,
                  backgroundColor: "#000",
                },
              ]}
              onPress={() => payment()}
            >
              <Text style={[styles.text, { color: "#fff" }]}>Purchase</Text>
            </TouchableOpacity>
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
      <Text style={styles.headerText}>My Cart</Text>

      <StatusBar barStyle="dark-content" backgroundColor="#e6ecf5" />
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      <View style={styles.footerContainer}>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>Total Price</Text>
          <Text>₹{calculateTotalPrice().toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={() => payment()}>
          <Text style={styles.payButtonText}>Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default GetCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6ecf5",
  },
  headerText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 20,
    fontWeight: "600",
    color: "#135399",
    width: "auto",
    textTransform: "uppercase",
  },
  childContainer: {},
  cartitem: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 40,
    elevation: 10,
    shadowColor: "#000",
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  cartImage: {
    borderTopStartRadius: 40,
    borderBottomStartRadius: 40,
    marginEnd: 15,
    overflow: "hidden",
  },
  foodName: {
    textTransform: "capitalize",
    fontSize: 15,
    fontWeight: "500",
    color: "#000",
    textTransform: "uppercase",
    marginEnd: 20,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#000",
    width: 100,
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 10,
    padding: 10,
    elevation: 2,
    borderRadius: 30,
  },
  quantityText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "300",
  },
  priceText: {
    fontSize: 15,
  },
  footerContainer: {
    backgroundColor: "#fff",
    marginTop: 20,
    paddingTop: 70,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  totalPriceContainer: {
    margin: 20,
  },
  totalPriceText: {
    fontSize: 20,
  },
  payButton: {
    backgroundColor: "#000",
    margin: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    borderRadius: 30,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  desc: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.7,
    color: "#000",
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
});
