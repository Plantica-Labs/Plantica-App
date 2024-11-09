/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  useColorScheme,
  View,
} from 'react-native';

import {
  checkForNotificationPermission,
  createChannels,
  getDeviceToken,
} from './utils/notification';

import MqttClient, {ClientEvent} from '@ko-developerhong/react-native-mqtt';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {getWateringLevel} from './utils/humidity';
import {LineChart} from 'react-native-gifted-charts';
import messaging from '@react-native-firebase/messaging';
import useSwr from 'swr';
import notifee from '@notifee/react-native';
import {PointerLabelComponent} from './components/GraphElements';
import {getGraphData} from './api';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentMoisture, setCurrentMoisture] = useState(0);
  const {data: graphData, mutate, isLoading} = useSwr('plant1', getGraphData);

  useEffect(() => {
    // Fetch the data from server and update it when sensor is at rest
    if (currentMoisture === 0 && graphData?.at(-1)?.value) {
      setCurrentMoisture(graphData.at(-1)?.value!);
    }
  }, [currentMoisture, graphData]);

  const subscribeToMqtt = useRef(async () => {
    try {
      await MqttClient.connect('mqtt://192.168.31.3', {});
      MqttClient.on(ClientEvent.Message, (topic, msg) => {
        setCurrentMoisture(+msg.toString());
        mutate();
      });
      MqttClient.on(ClientEvent.Connect, () => {
        ToastAndroid.show('Connected to live server!', ToastAndroid.SHORT);
        MqttClient.subscribe('plantica/plant1');
      });
    } catch (err) {
      // TODO: show toast notif in app instead of alert
      //@ts-ignore
      Alert.alert('Got error while connecting to MQTT server', err?.message);
      console.log('err', err);
    }
  }).current;

  useEffect(() => {
    getDeviceToken();
    subscribeToMqtt();
    createChannels();
    checkForNotificationPermission();
    // Handle notification when app is opened using Notifee
    const unsubscribe = messaging().onMessage(async msg => {
      notifee.displayNotification({
        title: msg.notification?.title,
        body: msg.notification?.body,
        android: {channelId: msg.notification?.android?.channelId},
      });
    });

    return () => {
      // cleanup on component unmount
      unsubscribe();
      MqttClient.disconnect();
    };
  }, []);

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text style={{color: 'grey', fontSize: 16, marginBottom: 20}}>
        Plantica — smart watering
      </Text>
      <AnimatedCircularProgress
        size={180}
        width={20}
        fill={currentMoisture}
        tintColor="#27ae60"
        backgroundColor="#ecf0f1"
        lineCap="round"
        arcSweepAngle={260}
        rotation={230}>
        {() => (
          <Text style={styles.sectionTitle}>
            {currentMoisture}
            <Text style={{fontSize: 24}}>%</Text>
          </Text>
        )}
      </AnimatedCircularProgress>
      <Text
        style={{
          fontSize: 18,
          fontWeight: '600',
          color: '#000',
        }}>
        {getWateringLevel(currentMoisture)}-watered
      </Text>

      <View style={{height: 40}} />
      {graphData && !isLoading ? (
        <LineChart
          curved
          areaChart
          initialSpacing={0}
          noOfSections={4}
          height={250}
          color="#166534"
          showDataPointLabelOnFocus
          spacing={10}
          hideDataPoints
          startFillColor="#27ae60"
          data={graphData}
          showStripOnFocus
          scrollToEnd
          pointerConfig={{
            pointerStripHeight: 160,
            pointerStripColor: '#27ae60',
            pointerStripWidth: 2,
            pointerColor: 'black',
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: PointerLabelComponent,
          }}
        />
      ) : (
        <ActivityIndicator size="large" />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    gap: 20,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 40,
  },
  sectionTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#0f172a',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
});

export default App;
