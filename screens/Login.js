import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import firebase, { firebaseConfig } from '../db/firebase';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useNavigation } from '@react-navigation/native';
const Login = () => {
  const navigation = useNavigation();
  const [number, setNumber] = useState(null);
  const [code, setCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);
  const [authenticated, setAuthenticated] = useState(false);


  const submitnoverifcation = () => {
    console.log(phoneNumber);
    const phoneProvider = new firebase.firebase.auth.PhoneAuthProvider();
    phoneProvider
      .verifyPhoneNumber('+91' + phoneNumber, recaptchaVerifier.current)
      .then(setVerificationId);
    setPhoneNumber('');
  }

  useEffect(() => {
    firebase.firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    })
  }, [])
  // useEffect(() =>{
  //   if(authenticated == true){
  //     navigation.push('Home', { uid: firebase.firebase.auth().currentUser.uid });
  //   }
  // })
  console.log(authenticated);
  const confirmCode = () => {
    const credential = firebase.firebase.auth.PhoneAuthProvider.credential(
      verificationId,
      code
    );
    firebase.firebase.auth().signInWithCredential(credential).then(async (credential) => {
      setCode('');
      const user = credential.user;
      console.log(credential);
      try {
        const userDocument = await firebase.firebase.firestore().collection('users').doc(user.uid).get();
        if (userDocument.exists) {
          console.log("exists", true);
          Alert.alert('login success');
          navigation.push('Home', { uid: user.uid });
        } else {
          console.log("not exists", true);
          navigation.navigate('Detail', { uid: user.uid });
        }
      } catch (e) {
        console.log(e);
        Alert.alert("Invalid Code");
      }

    }).catch((err) => {
      console.log("error from sms", err);
      Alert.alert("Something Went Wrong");
    })

  }
  return (

    <View style={{
      flex: 1,
      backgroundColor: "#fff",
    }}>
      <StatusBar style='light' backgroundColor='green' />
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
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
          Forgate your password?
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
        }}>Let's Get Something</Text>
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
          <TextInput placeholder='Phone Number' autoComplete='tel' keyboardType='number-pad' onChangeText={setPhoneNumber} value={phoneNumber} style={styles.input} />
          <TextInput placeholder='Comfirm Password' style={styles.input} value={code} keyboardType='number-pad' onChangeText={setCode} autoComplete='tel' />
        </View>

        <View>
          <TouchableOpacity style={styles.button} onPress={() => submitnoverifcation()}>
            <Text style={{
              color: "#fff",
              fontWeight: "bold",

            }}>SIGN IN</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => confirmCode()}>
            <Text style={{
              color: "#fff",
              fontWeight: "bold",

            }}>Comfirm OTP</Text>
          </TouchableOpacity>
          <Text style={{
            textAlign: "center",
          }}>
            Don't have an account yet? <Text>Sign in</Text>
          </Text>
        </View>
      </View>
    </View>
  )
}

export default Login

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