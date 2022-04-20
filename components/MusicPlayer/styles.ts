import { StyleSheet } from "react-native";

const styles = StyleSheet.create ({
    recAudioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        alignSelf: 'stretch',
        backgroundColor: 'white'
    },
    audioBar: {
        margin: 10,
        flex: 1,
        height: 2,
        backgroundColor: '#008080',
        borderRadius: 10,
    },
    audioDot: {
        width: 10,
        height: 10,
        borderRadius: 10,
        backgroundColor: '#008080',
        position: 'absolute',
        top: -4
    }
});

export default styles;