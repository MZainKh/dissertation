import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import styles from './styles';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Feather } from '@expo/vector-icons';

const MusicPlayer = ({ audioUri }) => {
    const [audio, setAudio] = useState<Audio.Sound|null>(null);
    const [playing, setPlaying] = useState(false);
    const [audioProg, setAudioProg] = useState(0);
    const [audioLen, setAudioLen] = useState(0);

    useEffect(() => {
        loadAudio();
        () => {
            // unload audio
            if (audio) {
                audio.unloadAsync();
            }
        };
    }, [audioUri]);

    const loadAudio = async () => {
        if (!audioUri) {
            return;
        }
        const { sound } = await Audio.Sound.createAsync({ uri: audioUri }, {}, onPlaybackStatusUpdate);
        setAudio(sound);
    }

    const onPlaybackStatusUpdate = (progress: AVPlaybackStatus) => {
        if (!progress.isLoaded) {
            return;
        }
        setAudioProg(progress.positionMillis / (progress.durationMillis || 1));
        setPlaying(progress.isPlaying);
        setAudioLen(progress.durationMillis || 0);
    }

    const audioLenFormatted = () => {
        const mins = Math.floor(audioLen / (60 * 1000));
        const secs = Math.floor((audioLen % (60 * 1000)) / 1000);
        
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    
    const soundPlayPause = async () => {
        if (!audio) {
            return;
        }
        if (!playing) {
            await audio.playFromPositionAsync(0);
        } else {
            await audio.stopAsync();
        }
    }

  return (
    <View style = {styles.recAudioContainer}>
        <Pressable onPress = {soundPlayPause}>
            <Feather name={playing ? "pause" : "play"} size={20} color="#008080" />
        </Pressable>
        <View style = {styles.audioBar}>
            <View style = {[styles.audioDot, {left: `${audioProg * 100}%`}]}></View>
        </View>
        <Text style = {{color: '#008080'}}>{audioLenFormatted()}</Text>
    </View>
  );
};

export default MusicPlayer;