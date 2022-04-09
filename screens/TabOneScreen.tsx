import * as React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

export default function TabOneScreen() {
  return (
    <View style={styles.pageList}>
      <View style={styles.container}>
        <Image source={require('../assets/images/gojou.jpeg')} style={styles.image}></Image>
        <View style={styles.rContainer}>
          <View style={styles.row}>
            <Text style={styles.name}>Gojo Satoru</Text>
            <Text style={styles.text}>04:07 PM</Text>
          </View>
          <Text numberOfLines={1} style={styles.text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde asperiores iste est praesentium iure, perspiciatis quod ipsum repellat inventore nesciunt!</Text>
          <View style={styles.unreadContainer}>
            <Text style={styles.unreadText}>7</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginRight: 10
  },
  rContainer: {
    flex: 0.9,
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  text: {
    color: 'grey'
  },
  unreadContainer: {
    backgroundColor: 'lightgrey',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -30,
  },
  unreadText: {
    fontSize: 10,
    color: 'black'
  }
});