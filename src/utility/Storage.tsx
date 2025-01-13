import AsyncStorage from '@react-native-async-storage/async-storage';

export const setValue = async (
  key: string,
  value: string | Record<string, any>,
) => {
  const val = typeof value == 'string' ? value : JSON.stringify(value);
  try {
    await AsyncStorage.setItem(key, val);
  } catch (e) {}
};

export const getValue = async (key: string) => {
  try {
    const result = await AsyncStorage.getItem('my-key');
    if (!result) return null;
    try {
      return JSON.parse(result);
    } catch (error) {
      return result;
    }
  } catch (e) {
    return null;
  }
};
