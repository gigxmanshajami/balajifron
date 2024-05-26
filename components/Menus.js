import { FlatList, StyleSheet, Text, TouchableOpacity, Vibration, View } from 'react-native'
import React, { useState } from 'react'

const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
    </TouchableOpacity>
);
const Menus = () => {
    const [selectedId, setSelectedId] = useState();
    const DATA = [
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            title: 'Salads',
        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
            title: 'Hot Sale',
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            title: 'Popularity',
        },
    ];
    const renderItem = ({ item }) => {

        return (
            <TouchableOpacity onPress={() => {
                Vibration.vibrate(100)
            }} style={styles.renderParent}>
                <Text style={styles.renderText}>
                    {item.title}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                data={DATA}
                style={{
                    padding: 10,
                }}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                extraData={selectedId}
            />
        </View>
    )
}

export default Menus

const styles = StyleSheet.create({
    renderParent: {
        backgroundColor: '#000',
        padding: 15,
        margin: 10,
        paddingRight: 25,
        paddingLeft: 25,
        flex: 1,
        borderRadius: 50,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        textAlign: "center",
    },
    renderText: {
        color: 'white',
        fontWeight: '800',
    },

})