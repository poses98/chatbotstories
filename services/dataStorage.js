import * as SecureStore from 'expo-secure-store';

const storeData = async (key, value) => {
  try {
    console.log(JSON.stringify(value));
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  } catch (error) {
    console.log('storeData error');
    console.log(error);
  }
};

const getData = async (key) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.log('getData error');
    console.log(error);
  }
};

export { storeData, getData };
