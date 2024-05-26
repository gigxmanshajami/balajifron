import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import firebase, { firebaseConfig } from '../db/firebase';
const Details = ({ route, navigation }) => {
    const { uid } = route.params;
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');
    console.log(uid);
    const saveDetails = () => {
        console.log(uid, "hello");
        firebase.firebase.firestore().collection("users").doc(uid).set({
            uid: uid,
            fullName: fullName,
            number: '+91' + phoneNumber,
        }).then(() => {
            console.log(true);
            navigation.push("Home", { uid: uid });
        }).catch(err => {
            console.log("dude something went wrong:)", err);
        })

    }

    return (<View style={{
        flex: 1,
        backgroundColor: "#fff",
    }}>
        <StatusBar barStyle="light-content" backgroundColor="green" />
        <View style={{
            position: "relative",
            backgroundColor: "green",
            padding: 40,
            marginBottom: 7,
            zIndex: -20,
        }}>
            <Text style={{
                color: "#fff",
                fontWeight: "600",
                alignSelf: "flex-end",
                fontSize: 20,
            }}>

            </Text>
        </View>
        <View style={{
            padding: 20,
            zIndex: 10000,
            top: -20,
            paddingTop: 25,
            borderTopEndRadius: 20,
            borderTopStartRadius: 20,
            position: "relative",
            backgroundColor: "#fff",
        }}>
            <Text style={{
                fontSize: 25,
                fontWeight: '500',
                marginBottom: 2,
                textTransform: 'capitalize',
            }}>Tell  us a Bit About yourself :)</Text>
            <Text style={{
                fontWeight: '300',
                marginBottom: 2,
                fontSize: 20,
                color: "#8c8c8c",
            }}>Good to see you back.</Text>
            <View>
                {/* SOCIALS */}
            </View>
            <View>
                <TextInput placeholder='Full Name' autoComplete='off' onChangeText={setFullName} value={fullName} style={styles.input} />
                <TextInput placeholder='Phone Number' autoComplete='tel' keyboardType='number-pad' onChangeText={setPhoneNumber} value={phoneNumber} style={styles.input} />
            </View>

            <View>
                <TouchableOpacity style={styles.button} onPress={() => saveDetails()}>
                    <Text style={{
                        color: "#fff",
                        fontWeight: "bold",

                    }}>Submit</Text>
                </TouchableOpacity>

                <Text style={{
                    textAlign: "center",
                }}>
                </Text>
            </View>
        </View>
    </View>
    )
}

export default Details

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    input: {
        height: 65,
        borderRadius: 25,
        padding: 20,
        marginBottom: 10,
        marginTop: 20,
        fontWeight: "500",
        fontSize: 20,
        backgroundColor: '#eee',
        color: '#000',
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        padding: 20,
        margin: 10,
        borderRadius: 20,
    },
})