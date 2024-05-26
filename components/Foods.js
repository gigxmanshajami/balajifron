import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Plus, Heart } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import firebase from '../db/firebase'


const Foods = () => {
    const todoRef = firebase.firebase.firestore().collection('foods');
    const [data, setData] = useState([]);
    const navigation = useNavigation();


    useEffect(() => {
        const unsubscribe = todoRef.onSnapshot(querySnapshot => {
            const newData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setData(newData);
            console.log(data);
        });

        return () => unsubscribe();
    }, []);


    const navigate = (item) => {
        Vibration.vibrate(100);
        navigation.navigate("FoodDetail", {
            item: item,
            uid: firebase.firebase.auth().currentUser.uid,
        })
    }
    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigate(item)} style={styles.renderParent} >
                <View style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                }}>
                    <Heart color="#000" />
                </View>
                <View style={{
                    padding: 20,
                }}>
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                    }}>
                        <View>
                            <Image source={{ uri: item.image }} style={{
                                width: 130,
                                height: 120
                            }} />
                        </View>
                        <View style={{
                            marginTop: 10,
                            flex: 1,
                        }}>
                            <Text style={styles.renderText}>
                                {item.foodName}
                            </Text>
                            <View style={{ width: 100, flex: 1, flexDirection: "row", justifyContent: "space-between" }} >
                                <Text style={{
                                    color: "#6d6c6c",
                                }} >
                                    {item.time}
                                </Text>
                                <Text style={{
                                    color: "#6d6c6c",
                                }} >
                                    {item.ratings}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: "space-between",
                }}>
                    <View>
                        <Text style={{
                            fontSize: 20,
                            color: "#000",
                            alignItems: "center",
                            marginLeft: 13,
                            fontWeight: "bold"
                        }}>
                            {item.foodPrice}
                        </Text>
                    </View>
                    <View style={{
                        backgroundColor: "#000",
                        alignItems: "flex-end",
                        alignSelf: "flex-end",
                        padding: 10,
                        borderTopLeftRadius: 20,
                    }} >
                        <Plus color="#fff" />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <FlatList
            data={data}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            contentContainerStyle={{
                paddingBottom: 100,
            }}
            style={
                {
                    paddingRight: 14,
                    paddingLeft: 14,
                    marginBottom: 40,
                }
            }
            numColumns={2}
            renderItem={renderItem}
        />
    )
}

export default Foods

const styles = StyleSheet.create({
    renderParent: {
        width: 150,
        flex: 1,
        margin: 10,
        overflow: 'hidden',
        borderRadius: 10,
        backgroundColor: '#eee',
    },
    renderText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginTop: 10,
    }
})