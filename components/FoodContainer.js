import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Menus from './Menus'
import Foods from './Foods'

const FoodContainer = () => {
    return (
        <SafeAreaView
            style={{
                marginBottom: 20,
            }}
        >
            <View style={{ paddingRight: 20, paddingLeft: 20, }}>
                <Text style={styles.textPar}>Top Picks</Text>
            </View>
            {/* menus navigation */}
            <Menus />
            <Foods />
        </SafeAreaView>
    )
}

export default FoodContainer

const styles = StyleSheet.create({
    textPar: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        padding: 10
    }
})