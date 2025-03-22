

import React from 'react';
import {
    Image,
    View,
    Text, 
    Pressable, 
    Alert, 
    FlatList,
    TouchableOpacity
} from 'react-native';


import { styles } from '../css/style';



const SideMenu = ({showMenu,setShowMenu}) => {

    return <View
        style={
            { ...styles.sideBar, display: 'flex', flexDirection: 'column' }

        }>
        <View style={{ ...styles.header, borderColor: 'grey', minHeight: '8%' }}>
            <Pressable
                style={{ ...styles.menu_ico, marginTop: 6 }}
                onPress={() => {
                    setShowMenu(!showMenu);
                }}>
                <View style={[styles.menu_ico_bar, styles.bar11]}></View>
                <View style={[styles.menu_ico_bar, styles.bar11]}></View>
                <View style={[styles.menu_ico_bar, styles.bar11]}></View>
            </Pressable>

            <View style={styles.logo_container}>
                <Image
                    style={styles.logo}
                    resizeMode="contain"
                    source={require('../assets/Logo.png')}
                />
            </View>

            <View style={styles.search_ico}>
                <Image
                    style={styles.search_ico_img}
                    // resizeMode="contain"
                    source={require('../assets/search.png')}
                />
            </View>
        </View>
        <Image
            style={{
                ...styles.heading_underline,
                minWidth: '80%',
                marginHorizontal: 'auto',
            }}
            source={require('../assets/underline.png')}
        />

        <Pressable
            style={{
                padding: 22,
                marginLeft: -6,
                marginTop: 15,
                backgroundColor: '#ffbc00',
                width: '60%',
                borderEndEndRadius: 50,
                borderTopEndRadius: 50,
            }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Signup/Login</Text>
        </Pressable>

        <View>
            <TouchableOpacity style={{ ...styles.sideBarServices }}>
                <Text style={{ fontSize: 22 }}>Services</Text>
                <Text style={{ fontSize: 35, marginTop: 7 }}>^</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.sideBarServices }}>
                <Text style={{ fontSize: 22 }}>Category</Text>
                <Text style={{ fontSize: 35, marginTop: 7 }}>^</Text>
            </TouchableOpacity>{' '}
            <TouchableOpacity style={{ ...styles.sideBarServices }}>
                <Text style={{ fontSize: 22 }}>Category</Text>
                <Text style={{ fontSize: 35, marginTop: 7 }}>^</Text>
            </TouchableOpacity>{' '}
            <TouchableOpacity style={{ ...styles.sideBarServices }}>
                <Text style={{ fontSize: 22 }}>Category</Text>
                <Text style={{ fontSize: 35, marginTop: 7 }}>^</Text>
            </TouchableOpacity>
        </View>
    </View>


}

export default SideMenu;