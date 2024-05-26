import { StyleSheet, Image, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigationContainerRef, } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home';
const Stack = createNativeStackNavigator();
import { MapPin, Menu, User, ShoppingCart } from "lucide-react-native";
import FoodDetails from './screens/FoodDetails';
import Login from './screens/Login';
import Details from './screens/Details';
import GetCart from './screens/GetCart';
import UserProfile from './screens/UserProfile';
export default function App() {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            elevation: 0,
          },
          headerShadowVisible: false,
        }}
        initialRouteName='Login'
      >
        <Stack.Screen name='Cart' component={GetCart} options={{
          headerShadowVisible: false,
          headerShown: false,
        }} />
        <Stack.Screen name='Login' component={Login} options={{
          headerShadowVisible: false,
          headerShown: false,
        }} />
        <Stack.Screen name='Detail' component={Details} options={{
          headerShadowVisible: false,
          headerShown: false,
        }} />
        <Stack.Screen name='Profile' options={{
          headerShadowVisible: false,
          title: "My Profile",
          headerTitleAlign: 'center',
        }} component={UserProfile} />

        <Stack.Screen name="Home" options={{
          headerTitle: () => (
            ""
          ),
          headerBackVisible: false,
          headerLeft: () => (
            <>
              <MapPin size={24} color="black" />
              <Text style={{ marginLeft: 10, fontSize: 20, color: "black", fontWeight: "bold" }}>Hazaribagh</Text>
            </>
          ),
          headerRight: () => (

            <>

              <TouchableOpacity onPress={() => {
                Vibration.vibrate(100)
                navigationRef.navigate('Cart');
              }} style={{
                backgroundColor: "#eee",
                padding: 8,
                borderRadius: 20,
                marginRight: 10,
                justifyContent: "center",
                alignItems: "center",
              }}>
                <ShoppingCart strokeWidth={1} size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={{
                backgroundColor: "#eee",
                padding: 8,
                borderRadius: 20,
                marginRight: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
                onPress={() => {
                  Vibration.vibrate(100)
                  navigationRef.navigate('Profile');
                }}
              >
                <User size={24} strokeWidth={1} color="black" />
              </TouchableOpacity>
            </>
          ),
        }} component={Home} />
        <Stack.Screen name='FoodDetail' component={FoodDetails} />

      </Stack.Navigator>
    </NavigationContainer >
  );
}
