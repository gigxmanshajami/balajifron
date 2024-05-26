import { Button, Image, StatusBar, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, Vibration, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Heart, Plus, Minus } from "lucide-react-native";
import firebase from '../db/firebase';
const FoodDetails = () => {
    const route = useRoute();
    const data = route.params?.item;
    const [opte, setOpte] = useState(1);
    const operation = (opt) => {
        Vibration.vibrate(100);
        if (opt === "+") {
            setOpte(opte + 1);
        } else if (opt === '-') {
            if (opte > 1) {
                setOpte(opte - 1);
            }
        }
    }
    const addToCart = async (data) => {
        const userId = uid;
        const cartItem = {
            data: {
                ...data,
                quantity: opte > 0 ? opte : 1,
            },
            // quantity: opte > 0 ? opte : 1,
        };
        // newQuantity > 0 ? newQuantity : 1

        try {
            const userDoc = await firebase.firebase.firestore().collection('users').doc(userId).get();

            if (userDoc.exists) {

                await userDoc.ref.update({
                    cart: firebase.firebase.firestore.FieldValue.arrayUnion(cartItem),
                });
            } else {

                await firebase.firebase.firestore().collection('users').doc(userId).set({
                    cart: [cartItem],
                });
            }

            console.log('Item added to cart successfully!');
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const navigation = useNavigation();
    const { uid } = route.params;
    console.log(uid);
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "",
            headerStyle: {
                backgroundColor: "green"
            },
            headerTintColor: "white",
            headerRight: () => (
                <>
                    <Heart size={24} color="#fff" style={{
                        marginRight: 11,
                    }} />
                </>
            )
        });
    }, [navigation]);
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="green" />
            <View style={{
                alignItems: "center",
                backgroundColor: "green",
                height: 200,
            }}>
                <Image source={{ uri: data.image }} style={{
                    width: 280,
                    height: 280,
                    position: "relative",
                    zIndex: 1000,
                }} />
            </View>
            <View style={{
                borderTopStartRadius: 30,
                zIndex: -1,
                borderTopEndRadius: 30,
                flex: 1,
                padding: 20,
                borderWidth: 1,
                backgroundColor: "#fff",
                justifyContent: "space-between",
                borderColor: "#FFF",
            }}>
                <View style={{ marginTop: 90 }}>
                    <View style={{ alignItems: "center" }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                            backgroundColor: "#000",
                            width: 120,
                            paddingRight: 10,
                            paddingLeft: 10,
                            padding: 10,
                            elevation: 2,
                            borderRadius: 30,
                        }}>
                            <View><Plus onPress={() => operation("+")} color="#fff" /></View>
                            <View><Text style={{
                                color: "#fff",
                                fontSize: 25,
                                fontWeight: "300",
                            }}>
                                {opte}</Text></View>
                            <View><Minus onPress={() => operation("-")} color="#fff" /></View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20 }} >
                        <Text style={{ fontWeight: "bold", fontSize: 35 }}>
                            {data.foodName}
                        </Text>
                        <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                            {data.foodPrice}
                        </Text>
                        <Text style={{ fontWeight: "400", fontSize: 15, color: "#8c8c8c", marginTop: 10, lineHeight: 20 }}>
                            {data.foodDescription}
                        </Text>
                    </View>
                </View>
                <TouchableWithoutFeedback
                    onPress={() => {
                        Vibration.vibrate(100)
                        addToCart(data);
                    }}
                >
                    <View style={{
                        backgroundColor: "#000",
                        padding: 20,
                        borderRadius: 20,
                        alignItems: "center",
                        elevation: 2,
                    }}>
                        <Text style={{
                            color: "#fff",
                            fontWeight: "bold",
                            fontSize: 20
                        }}>
                            Add To Cart
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    )
}

export default FoodDetails

const styles = StyleSheet.create({
    container: {
        backgroundColor: "green",
        flex: 1,
    },
    infoContainer: {
        backgroundColor: "#fff",
        padding: 20,
    }
})