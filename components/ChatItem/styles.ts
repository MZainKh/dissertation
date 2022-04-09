import { StyleSheet } from "react-native";

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

  export default styles;