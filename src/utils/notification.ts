import notifee, {AndroidImportance} from '@notifee/react-native';

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
      sound: 'water-me-more',
      ...defaultOptions,
    },

    {
      id: 'over-watering',
      name: 'Over Watering',
      sound: 'stop-stop',
      ...defaultOptions,
    },

    {
      id: 'no-watering',
      name: 'No Watering',
      sound: 'dog-pee',
      ...defaultOptions,
    },

    {
      id: 'optimal-watering',
      name: 'Optimal Watering',
      sound: '',
      ...defaultOptions,
    },
  ]);
};
