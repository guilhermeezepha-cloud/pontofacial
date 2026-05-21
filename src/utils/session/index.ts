import AsyncStorage from '@react-native-async-storage/async-storage';

type GetOptions = {useCache?: boolean};
type SetOptions = {useCache?: boolean};

type CacheEntry = {
  value: unknown;
  timestamp: number;
};

export class Session {
  private static memoryCache: Record<string, CacheEntry> = {};

  private static async _readFromStorage(
    key: string,
    opts: GetOptions,
    parseJson: boolean,
  ): Promise<unknown | null> {
    const {useCache = false} = opts;

    if (useCache && key in Session.memoryCache) {
      return Session.memoryCache[key].value;
    }

    try {
      const stored = await AsyncStorage.getItem(key);
      const value =
        stored != null ? (parseJson ? JSON.parse(stored) : stored) : null;
      if (useCache) {
        Session.memoryCache[key] = {value, timestamp: Date.now()};
      }
      return value;
    } catch (e) {
      return null;
    }
  }

  private static async _writeToStorage(
    key: string,
    rawValue: string,
    opts: SetOptions,
    cacheValue: unknown,
  ): Promise<void> {
    const {useCache = false} = opts;
    try {
      await AsyncStorage.setItem(key, rawValue);

      if (useCache) {
        Session.memoryCache[key] = {value: cacheValue, timestamp: Date.now()};
      } else {
        delete Session.memoryCache[key];
      }
    } catch (e) {
      console.warn('[Session] setItem failed for', key, e);
      throw e;
    }
  }

  static async set<T>(
    key: string,
    data: T,
    opts: SetOptions = {},
  ): Promise<void> {
    const jsonValue = JSON.stringify(data);
    await Session._writeToStorage(key, jsonValue, opts, data);
  }

  static async get<T>(key: string, opts: GetOptions = {}): Promise<T | null> {
    const result = await Session._readFromStorage(key, opts, true);
    return result as T | null;
  }

  static async setRaw(
    key: string,
    value: string,
    opts: SetOptions = {},
  ): Promise<void> {
    await Session._writeToStorage(key, value, opts, value);
  }

  static async getRaw(
    key: string,
    opts: GetOptions = {},
  ): Promise<string | null> {
    const result = await Session._readFromStorage(key, opts, false);
    return result as string | null;
  }

  static async destroy(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      delete Session.memoryCache[key];
    } catch (e) {}
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      Session.memoryCache = {};
    } catch (e) {}
  }

  static invalidate(key: string) {
    delete Session.memoryCache[key];
  }
}

export default Session;
