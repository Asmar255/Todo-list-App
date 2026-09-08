import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

let Notifications: typeof import('expo-notifications') | null = null;

if (!isExpoGo) {
  try {
    Notifications = require('expo-notifications');
    Notifications?.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch {
    // Graceful fallback if module isn't linked
  }
}

export async function registerForNotificationsAsync(): Promise<void> {
  if (isExpoGo || !Notifications) return;

  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      await Notifications.requestPermissionsAsync();
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  } catch (error) {
    console.log("Notification permissions failed:", error);
  }
}

export async function scheduleTaskNotification(
  title: string,
  body: string,
  scheduledDate?: Date
): Promise<void> {
  if (isExpoGo || !Notifications) return;

  try {
    let trigger: any = null;

    if (scheduledDate) {
      const targetDate = new Date();
      targetDate.setHours(scheduledDate.getHours(), scheduledDate.getMinutes(), 0, 0);
      if (targetDate.getTime() <= Date.now()) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: targetDate,
      };
    }

    await Notifications.scheduleNotificationAsync({
      content: { title, body },
      trigger,
    });
  } catch (error) {
    console.log("Failed to schedule notification:", error);
  }
}