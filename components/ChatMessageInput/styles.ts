import { StyleSheet } from "react-native";

const styles = StyleSheet.create ({
    root: {
        padding: 10,
        height: '50%'
    },
    inputRow: {
        flexDirection: 'row'
    },
    inContainer: {
        backgroundColor: '#f2f2f2',
        flexDirection: 'row',
        flex: 1,
        marginRight: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'grey',
        alignItems: 'center',
        padding: 5
    },
    icon: {
        marginHorizontal: 5
    },
    tInput: {
        flex: 1,
        marginHorizontal: 5
    },
    btnContainer: {
        width: 40,
        height: 40,
        backgroundColor: '#008080',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: 'white',
        fontSize: 35
    },
    selectedImgContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        alignSelf: 'stretch',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 10
    }
})

export default styles;