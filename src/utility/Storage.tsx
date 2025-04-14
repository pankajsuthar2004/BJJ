import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @param {string} key
 * @param {string | Record<string, any>} value
 */
export const setValue = async (
  key: string,
  value: string | Record<string, any>,
) => {
  try {
    const val = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, val);
  } catch (error) {
    console.error(`Error saving data for key "${key}":`, error);
  }
};

/**
 * @param {string} key
 * @returns {Promise<any | null>}
 */
export const getValue = async (key: string) => {
  try {
    const result = await AsyncStorage.getItem(key);
    if (!result) return null;

    return JSON.parse(result);
  } catch (error) {
    console.error(`Error retrieving data for key "${key}":`, error);
    return null;
  }
};

/**
 @param {string} key 
 */
export const removeValue = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
  }
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared successfully.');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

/**
 * @param {string} key
 * @returns {Promise<boolean>}
 */
export const keyExists = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null;
  } catch (error) {
    console.error(`Error checking existence for key "${key}":`, error);
    return false;
  }
};
