import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
//import { AnimatedTabBarNavigator } from "react-native-animated-nav-tab-bar";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import OneSignal from 'react-native-onesignal';
import {
  Alert,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import config from './src/config/config';
import MainNavigator from './src/components/Stacks/MainNavigator';
import {LogBox, StatusBar} from 'react-native';
import {NativeBaseProvider} from 'native-base';
import NetInfo from '@react-native-community/netinfo';
import * as Animatable from 'react-native-animatable';
import VersionCheck from 'react-native-version-check';
import CustomFastImage from './src/components/common/CustomFastImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpInAppUpdates, {
  NeedsUpdateResponse,
  IAUUpdateKind,
  StartUpdateOptions,
} from 'sp-react-native-in-app-updates';
import Toast from 'react-native-tiny-toast';

const Stack = createStackNavigator();
const navOptionHandler = () => ({
  headerShown: false,
});
function MainStack() {
  return (
    <Stack.Navigator initialRouteName="MainNavigator">
      <Stack.Screen
        name="MainNavigator"
        component={MainNavigator}
        options={navOptionHandler}
      />
    </Stack.Navigator>
  );
}

const StackApp = createStackNavigator();
export default function App(navigation) {
  const [Show, setShow] = useState(false);
  const [TotalDownload, setTotalDownload] = useState('');
  const [ToBeDownload, setToBeDownload] = useState('');
  const [DownloadStatus, setDownloadStatus] = useState('');
  const [newVersionRequired, setnewVersionRequired] = useState(false);
  const [InternetActiveStatus, setInternetActiveStatus] = useState(false);
  const [ShowInternetAlert, setShowInternetAlert] = useState(false);
  const [newVersion, setnewVersion] = useState('');
  const [oldVersion, setoldVersion] = useState('');
  const [EmergencyUpdate, setEmergencyUpdate] = useState(false);
  const ConfigureOneSignal = async () => {
    OneSignal.setAppId('53663bb6-1516-44c5-bda4-620864f02db9');
    OneSignal.setLogLevel(6, 0);
    OneSignal.setRequiresUserPrivacyConsent(false);
    OneSignal.promptForPushNotificationsWithUserResponse((response) => {
      console.log('Prompt response:', response);
    });
    OneSignal.setNotificationWillShowInForegroundHandler(
      (notifReceivedEvent) => {
        setShow(true);
        console.log(
          'OneSignal: notification will show in foreground:',
          notifReceivedEvent,
        );
        let notif = notifReceivedEvent.getNotification();

        const button1 = {
          text: 'Cancel',
          onPress: () => {
            notifReceivedEvent.complete();
          },
          style: 'cancel',
        };

        const button2 = {
          text: 'Complete',
          onPress: () => {
            navigation.replace('Notifications', {
              notification: notifReceivedEvent.complete(notif),
            });
            notifReceivedEvent.complete(notif);
          },
        };

        Alert.alert(
          notifReceivedEvent.notification.title,
          notifReceivedEvent.notification.body,
          [button1, button2],
          {
            cancelable: true,
          },
        );
      },
    );
    OneSignal.setNotificationOpenedHandler((notification) => {
      console.log('OneSignal: notification opened:', notification);
    });
    OneSignal.setInAppMessageClickHandler((event) => {
      console.log('OneSignal IAM clicked:', event);
    });
    OneSignal.addEmailSubscriptionObserver((event) => {
      console.log('OneSignal: email subscription changed: ', event);
    });
    OneSignal.addSubscriptionObserver((event) => {
      console.log('OneSignal: subscription changed:', event);
      console.log('isSubscribed:', event.to.isSubscribed);
    });
    OneSignal.addPermissionObserver((event) => {
      console.log('OneSignal: permission changed:', event);
    });
    //const playerId = await OneSignal.getDeviceState();
    //storeData('playerId', playerId.userId);

    //alert(JSON.stringify(playerId.userId));
    const deviceState = await OneSignal.getDeviceState();
    console.log('deviceState.isSubscribed = ', deviceState.isSubscribed);
    console.log('deviceState = ', deviceState);
    //this.setState({
    //    isSubscribed : deviceState.isSubscribed
    //});

    //OneSignal.setLogLevel(7, 0);
    ////OneSignal.inFocusDisplaying(2);
    //OneSignal.init('53663bb6-1516-44c5-bda4-620864f02db9', {
    //  kOSSettingsKeyAutoPrompt: true,
    //  kOSSettingsKeyInAppLaunchURL: false,
    //  kOSSettingsKeyInFocusDisplayOption: 2,
    //});
    //OneSignal.configure({});
    //OneSignal.addEventListener('ids', onIds);
    //OneSignal.addEventListener('received', onReceived);
    //OneSignal.addEventListener('opened', onOpened);
    // setTimeout(() => {
    //   this.setState({loader: false});
    // }, 1200);
  };
  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs(['new NativeEventEmitter']);
    LogBox.ignoreAllLogs();
    console.reportErrorsAsExceptions = false;
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      //alert(state.isConnected);
      if (state.isConnected) {
        setShowInternetAlert(false);
        setInternetActiveStatus(true);
        setTimeout(() => {
          setInternetActiveStatus(false);
        }, 2000);
      } else {
        setShowInternetAlert(true);
      }
    });
    checkUpdateVersion();
    //const EmergencyUpdateVar = AsyncStorage.getItem('EmergencyUpdate');
    //console.log('EmergencyUpdate = ', EmergencyUpdate);
    //setEmergencyUpdate(EmergencyUpdateVar);
    //console.log(
    //  'newVersionRequired = ',
    //  newVersionRequired,
    //  'EmergencyUpdate = ',
    //  EmergencyUpdate,
    //);
    //if (newVersionRequired && EmergencyUpdate == 'true') {
    //  console.log('hit');
    //  Alert.alert(
    //    'New App Updation Available',
    //    'Hey! You are using an older version ' +
    //      oldVersion +
    //      '. New Update Available ' +
    //      newVersion +
    //      '. Update app and enjoy the new features! ',

    //    [
    //      ({
    //        text: 'Cancel',
    //        onPress: () => console.log('Cancel Pressed'),
    //        style: 'cancel',
    //      },
    //      {
    //        text: 'Update',
    //        cancelable: false,
    //        onPress: () => {
    //          goToPlayStore();
    //        },
    //      }),
    //    ],
    //  );
    //}
    ConfigureOneSignal();
    return () => {
      unsubscribe();
      //OneSignal.removeEventListener('ids', onIds);
      //OneSignal.removeEventListener('received', onReceived);
      //OneSignal.removeEventListener('opened', onOpened);
    };
  }, []);
  function onReceived(notification) {
    console.log('Notification received: ', notification);
  }
  function onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }
  function onIds(device) {
    console.log('Device info: ', device);
  }
  const inAppUpdates = new SpInAppUpdates(
    false, // isDebug
  );
  const checkUpdateVersion = () => {
    console.log('hitt');
    VersionCheck.needUpdate().then(async (res) => {
      console.log('res = ', res);
      await AsyncStorage.setItem('version', res.currentVersion);
      console.log('update needed ==>', res.isNeeded);
      const oldVersion = res.currentVersion;
      const newVersion = res.latestVersion;
      setoldVersion(oldVersion);
      setnewVersion(newVersion);
      console.log('oldVersion = ', oldVersion);
      console.log('newVersion = ', newVersion);
      if (res.isNeeded) {
        setnewVersionRequired(true);
      } else {
        setnewVersionRequired(false);
      }
    });
  };
  const goToPlayStore = async () => {
    //inAppUpdates.checkNeedsUpdate({curVersion: oldVersion}).then((result) => {
    //  console.log('rsult = ', result);
    //  if (result.shouldUpdate) {
    //    let updateOptions = Platform.select({
    //      ios: {
    //        title: 'Update available',
    //        message:
    //          'There is a new version of the app available on the App Store, do you want to update it?',
    //        buttonUpgradeText: 'Update',
    //        buttonCancelText: 'Cancel',
    //        country: 'in', // 👈🏻 the country code for the specific version to lookup for (optional)
    //      },
    //      android: {
    //        updateType: IAUUpdateKind.IMMEDIATE,
    //      },
    //    });
    //    if (Platform.OS === 'android') {
    //      // android only, on iOS the user will be promped to go to your app store page
    //      updateOptions = {
    //        updateType: IAUUpdateKind.FLEXIBLE,
    //      };
    //    }
    //    inAppUpdates
    //      .startUpdate(updateOptions)
    //      .then((res) => {
    //        console.log('res = ', res);
    //      })
    //      .catch((err) => {
    //        console.log('err = ', err);
    //      }); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
    //    inAppUpdates.addStatusUpdateListener(onStatusUpdate);
    //  } else {
    //    console.log('error = ', result.reason);
    //    Toast.show(result.reason, {position: Toast.position.TOP});
    //  }
    //});
    //const onStatusUpdate = (event) => {
    //  // const {
    //  //   // status,
    //  //   bytesDownloaded,
    //  //   totalBytesToDownload,
    //  // } = status;
    //  // do something
    //  if (event.status == 11) {
    //    setnewVersionRequired(false);
    //    Toast.showSuccess('Successfully Download');
    //  }
    //  console.log(`@@ ${JSON.stringify(event)}`);
    //  setTotalDownload(event.totalBytesToDownload);
    //  setToBeDownload(event.bytesDownloaded);
    //  setDownloadStatus(event.status);
    //};

    const id = {
      appID: 1572663673,
      appName: 'clocktos',
      country: 'in',
    };
    //VersionCheck.setAppID(APP_ID);                    // Your App ID for App Store URL
    //VersionCheck.setAppName(APP_NAME);
    if (Platform.OS == 'ios') {
      //const url = await VersionCheck.getStoreUrl(id);
      const url = 'https://apps.apple.com/in/app/clocktos/id1572663673';
      console.log('url', url);
      Linking.canOpenURL(url).then(
        (supported) => {
          console.log('supported = ', supported);
          Linking.openURL(url)
            .catch(
              (e) => console.log(e),
              alert(
                'Something went wrong while updating the app. Please try again.',
              ),
            )
            .then(
              (success) => console.log('success = ', success),
              VersionCheck.needUpdate().then(async (res) => {
                console.log(res.isNeeded);
                if (!res.isNeeded) {
                  Toast.show('Your app is already up to date');
                  setnewVersionRequired(false);
                }
              }),
              // setnewVersionRequired(false)
            );
        },
        (err) => console.log(err),
      );
    } else {
      const url = await VersionCheck.getStoreUrl();
      console.log('url', url);
      Linking.openURL(url)
        .catch(
          (e) => console.log(e),
          alert(
            'Something went wrong while updating the app. Please try again.',
          ),
        )
        .then(
          (success) => console.log('success = ', success),
          VersionCheck.needUpdate().then(async (res) => {
            console.log(res.isNeeded);
            if (!res.isNeeded) {
              Toast.show('Your app is already up to date');
              setnewVersionRequired(false);
            }
          }),
          // setnewVersionRequired(false)
        );
    }
  };
  return (
    <SafeAreaProvider>
      {ShowInternetAlert && (
        <Animatable.View
          animation="slideInUp"
          //easing="ease-out"
          //iterationCount="infinite"
          style={{
            width: '100%',
            height: 35,
            position: 'absolute',
            zIndex: 2,
            backgroundColor: 'red',
            alignItems: 'center',
            marginTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white'}}>No Internet Connection</Text>
        </Animatable.View>
      )}
      {InternetActiveStatus && !ShowInternetAlert && (
        <Animatable.View
          animation="slideInDown"
          //easing="ease-out"
          //iterationCount="infinite"
          style={{
            width: '100%',
            height: 35,
            position: 'absolute',
            zIndex: 2,
            backgroundColor: 'green',
            alignItems: 'center',
            marginTop: Platform.OS === 'ios' ? 40 : StatusBar.currentHeight,
            justifyContent: 'center',
          }}>
          <Text style={{color: 'white'}}>Connected</Text>
        </Animatable.View>
      )}
      <NativeBaseProvider>
        <NavigationContainer>
          <StackApp.Navigator initialRouteName="MainStack">
            <StackApp.Screen
              name="MainStack"
              component={MainStack}
              options={navOptionHandler}
            />
          </StackApp.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
      {newVersionRequired && (
        <TouchableOpacity
          //disabled={TotalDownload != '' ? true : false}
          //style={{
          //  width: '95%',
          //  position: 'absolute',
          //  marginTop: 40,
          //  alignSelf: 'center',
          //  zIndex: 2,
          //}}
          onPress={() => {
            goToPlayStore();
          }}>
          <Animatable.View
            animation="slideInUp"
            //easing="ease-out"
            //iterationCount="infinite"
            style={{
              width: '95%',
              alignSelf: 'center',
              minHeight: 45,
              backgroundColor: config.PrimaryColor,
              borderRadius: 10,
              marginBottom: 20,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              justifyContent: 'space-between',
            }}>
            <CustomFastImage
              resizeMode={'contain'}
              style={{
                width: 30,
                height: 30,
              }}
              source={require('./src/assets/update.png')}
            />
            {TotalDownload == '' ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-evenly',
                  paddingHorizontal: 10,
                  //alignItems: 'center',
                }}>
                <Text
                  style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                  Update Available
                </Text>
                <Text style={{color: 'white'}}>
                  A new version {newVersion} of the app is available
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-evenly',
                  paddingHorizontal: 10,
                  //alignItems: 'center',
                }}>
                <Text
                  style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
                  Downloading...
                </Text>
                <Text style={{color: 'white'}}>
                  {ToBeDownload / TotalDownload}
                </Text>
              </View>
            )}
            {TotalDownload == '' ? (
              <CustomFastImage
                resizeMode={'contain'}
                style={{
                  width: 15,
                  height: 15,
                  tintColor: 'red',
                }}
                source={require('./src/assets/right-arrow.png')}
              />
            ) : null}
          </Animatable.View>
        </TouchableOpacity>
      )}
    </SafeAreaProvider>
  );
}
