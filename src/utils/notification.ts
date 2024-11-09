import notifee, {AndroidImportance} from '@notifee/react-native';

import messaging from '@react-native-firebase/messaging';
export const checkForNotificationPermission = async () => {
  await notifee.requestPermission();
  // TODO: Promp user to enable notification from setting if it's denied
};

export const getDeviceToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  // TODO: save token in DB
  console.log(token);
};
export const createChannels = async () => {
  const defaultOptions = {
    lights: true,
    vibration: true,
    importance: AndroidImportance.HIGH,
  };

  await notifee.createChannels([
    {
      id: 'under-watering',
      name: 'Under Watering',
      sound: 'water_me_more',
      ...defaultOptions,
    },

    {
      id: 'over-watering',
      name: 'Over Watering',
      sound: 'stop_stop',
      ...defaultOptions,
    },

    {
      id: 'no-watering',
      name: 'No Watering',
      sound: 'dog_pee',
      ...defaultOptions,
    },

    {
      id: 'optimal-watering',
      name: 'Optimal Watering',
      sound: 'just_raining',
      ...defaultOptions,
    },
  ]);
};
