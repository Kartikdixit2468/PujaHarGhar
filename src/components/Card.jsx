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
// import {SafeAreaView} from 'react-native-safe-area-context';
import { styles } from '../css/style'
// import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

function TrendingCard({data,CARD_WIDTH,CARD_HEIGHT}){
return  <FlatList
          data={data}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          pagingEnabled
          snapToInterval={CARD_WIDTH + 20}
          contentContainerStyle={styles.listContainer}
          renderItem={({item}) => (
            <View style={styles.card}>
              <View style={styles.card_image}>
                <Image
                  source={require('../assets/1.png')}
                  style={styles.image}
                />
                <Text style={styles.specialTag}>Holi Special 🎉</Text>
                <View style={styles.overlay} />
              </View>
              <View style={styles.bottomRow}>
                <Text style={styles.title}>{item.title}</Text>
                <TouchableOpacity style={styles.bookNowContainer}>
                  <Text style={[styles.bookNow,{fontSize:CARD_WIDTH*0.05}]}>Book Now →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
} 

function CategoryCard({ data, CARD_WIDTH, CARD_HEIGHT }) {
    return <FlatList
        style={{ marginHorizontal: 10 }}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        pagingEnabled
        snapToInterval={CARD_WIDTH + 20}
        contentContainerStyle={styles.categoryContainer}
        renderItem={({ item }) => (<Pressable
            style={{ ...styles.catCard }}
            onPress={() => {
                Alert.alert('Welcome to a dedicate page for ' + item.Name);
            }}>
            <View style={styles.catCard_image}>
                <Image
                    source={require('../assets/images/imagesCategory/ShivjiPooja.jpg')}
                    style={styles.image}
                />
                {/* <Text style={styles.specialTag}>Holi Special 🎉</Text> */}
                <View style={styles.overlay} />
            </View>
            <View style={styles.bottomRow}>
                <Text style={styles.title}>{item.Name}</Text>
            </View>
            <View style={styles.container_cat}>
                <View style={styles.glassBox}>
<FontAwesomeIcon icon={faHeart} size={CARD_WIDTH*0.13} color={Math.random()>0.5?"white":"red"}/>
                </View>
            </View>
        </Pressable>)} />

}

export {TrendingCard,CategoryCard}