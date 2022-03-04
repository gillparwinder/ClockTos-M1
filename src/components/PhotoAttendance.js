//import React, {useState} from 'react';
//import {TouchableOpacity} from 'react-native';
//import {StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';

//import {CustomHeader} from './CustomHeader';
//import {Loader} from './Loader';
//import config from '../config/config';
//import {RNCamera} from 'react-native-camera';
//import Icon from 'react-native-vector-icons/Feather';
//import AsyncStorage from '@react-native-async-storage/async-storage';
//import {FlatList} from 'react-native';
//import {ScrollView} from 'react-native';

//const PhotoAttendance = (props) => {
//  const [state, setState] = useState({
//    loader: false,
//    camera: null,
//  });

//  const [photos, setPhotos] = useState([]);
//  const [show, setShow] = useState(false);
//  const data = ['View 1', 'View 2', 'View 3', 'View 4', 'View 5', 'View 6'];
//  const RenderButton = ({
//    bgColor,
//    minWidth,
//    buttonText,
//    icon,
//    onPress,
//    disabled,
//  }) => {
//    return (
//      <TouchableOpacity
//        disabled={disabled}
//        onPress={onPress}
//        style={{
//          backgroundColor: bgColor,
//          minWidth: minWidth || null,
//          alignSelf: 'center',
//          alignItems: 'center',
//          justifyContent: 'center',
//          paddingVertical: 10,
//          paddingHorizontal: 10,
//          borderRadius: 10,
//          marginVertical: 20,
//          flexDirection: show ? 'row' : 'column',
//        }}>
//        <Text
//          style={{
//            color: 'white',
//            fontSize: config.textSize,
//            fontFamily: config.fontFamily.regular,
//            marginRight: 2,
//          }}>
//          {buttonText}
//        </Text>
//      </TouchableOpacity>
//    );
//  };
//  const takePicture = async (camera) => {
//    const options = {quality: 0.5, base64: true};
//    const token = await AsyncStorage.getItem('token');
//    const collegeCode = await AsyncStorage.getItem('collegeCode');
//    //console.log('CAMERA', camera);
//    if (camera) {
//      setState({...state, loader: true});
//      try {
//        const image = await camera.takePictureAsync(options);
//        if (image.uri) {
//          setPhotos([
//            ...photos,
//            {
//              image: image.base64,
//            },
//          ]);
//          setState({...state, loader: false});
//          //console.log('photos ==>', photos);
//          let formData = new FormData();

//          formData.append('images', photos);
//          formData.append('collegeCode', collegeCode.toString());
//          const configs = {
//            method: 'POST',
//            headers: {
//              Accept: 'application/json',
//              'Content-Type': 'application/json',
//              Authorization: 'Bearer ' + token,
//              //   Authorization:
//              //     'Bearer ' +
//              //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg3Y2JlMy00M2FlLTQzODYtODcyYS1jZWFkMmJlYTM1YTIiLCJVc2VyTmFtZSI6IjExMjMiLCJEQiI6ImFUNXV4ZGd2empUQ1IwaWhrSkV6YVcrWCpOTVVBcERMNUVPa1lnZHA5d0NCUk1YOWc3am5iTkdOdVVieUlmd0FRbG1rVkx4c0xPKnVVRWpBaHhkN3V2YVljZVY5UWhiaEVUZVc5Kk1BTzJydjVDY3BWK3hxMEJ6RHpuOEt4M2lZb3AzKzFXSDl5MzhDKkVmZUxBRXQ0V3djSThnZ2hFaFFaRUZ2TjlZcG9VdkUxaXo3eHhMUXRVSllabUwqd3FRS0k0b0VqZWtkSUNPOCo1ckpMYVRCUFl6cTFrVDZzZlQqVFQwa2d4YjRqeEg2OEQwSmlLK1QrT2orYXhjdXdDTDNNQ24yWjkreGkyeXRLUnplUjZpOXJ2eTYyYW1HdWVKTjJteEpoRHpUcmhyOTlKNXM1aGUqTFlYbzY3MWtNeHdYMkRHME9IaTErUFFMMzNKRndPMXZ5UT09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6InJhbWFiYWRyYW4iLCJ1c2VyX2NvZGUiOiIzMDkiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiIiwibmJmIjoxNjE2MTc1NDI2LCJleHAiOjE2MTYxODI2MjYsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ZiE5-dLDr7L33o_M64K5b9GuafauszbmJmNXW4hbgmQ',
//            },
//            body: formData,
//          };
//          const response = await fetch(
//            'http://103.87.172.204:5692/api/v1/student/validate/face',
//            configs,
//          );
//          console.log('esp', JSON.stringify(response, null, 4));
//          const json = await response.json();
//          console.log('JSON', json);
//          setShow(false);
//        }
//      } catch (e) {
//        console.log(e);
//        setState({...state, loader: false});
//      }
//    }
//  };

//  const renderItem = ({item, index}) => {
//    return (
//      <TouchableOpacity
//        onPress={() => setShow(true)}
//        style={{
//          borderRadius: 10,
//          padding: 10,
//          height: 40,
//          minWidth: 70,
//          margin: 20,
//          justifyContent: 'space-between',
//          backgroundColor: show ? '#24B1EE' : 'rgba(0,0,0,0.5)',
//          flexDirection: 'row',
//        }}>
//        <Text style={{color: 'white'}}>{item}</Text>
//        {show && <Icon name={'camera'} size={20} color="#ffffff" />}
//      </TouchableOpacity>
//    );
//  };

//  const captureAttendance = () => {
//    return props.navigation.goBack();
//  };

//  return (
//    <SafeAreaView style={{flex: 1}}>
//      <Loader Loading={state.loader ? true : false} />

//      <CustomHeader
//        isHome={false}
//        title={'Photo Attendance'}
//        navigation={props.navigation}
//        //notification
//      />
//      <View style={{flex: 1}}>
//        {show && (
//          <View style={{justifyContent: 'flex-end'}}>
//            <RNCamera
//              style={styles.preview}
//              type={RNCamera.Constants.Type.back}
//              flashMode={RNCamera.Constants.FlashMode.on}
//              androidCameraPermissionOptions={{
//                title: 'Permission to use camera',
//                message: 'We need your permission to use your camera',
//                buttonPositive: 'Ok',
//                buttonNegative: 'Cancel',
//              }}>
//              {({camera, status, recordAudioPermissionStatus}) => {
//                // if (status === 'READY') {
//                //   setState({...state, camera});
//                // }
//                console.log('Status', status);
//                if (status !== 'READY') return <View />;
//                return (
//                  <TouchableOpacity
//                    onPress={() => takePicture(camera)}
//                    style={styles.capture}>
//                    {/* <Text style={{fontSize: 14}}> SNAP </Text> */}
//                  </TouchableOpacity>
//                );
//              }}
//            </RNCamera>
//          </View>
//        )}
//      </View>
//      <View
//        style={{
//          //flex: 1,
//          //backgroundColor: 'yellow',
//          flexDirection: 'row',
//          width: '98%',
//          justifyContent: 'space-around',
//          alignItems: 'center',
//          alignSelf: 'center',
//        }}>
//        <RenderButton
//          bgColor={'#120E66'}
//          minWidth={'30%'}
//          buttonText={'Save'}
//          onPress={() => captureAttendance()}
//        />
//        <View
//          style={{
//            backgroundColor: '#120E66',
//            paddingHorizontal: 10,
//            paddingVertical: 5,
//            borderRadius: 15,
//          }}>
//          <Text
//            style={{
//              color: 'white',
//              fontFamily: config.fontFamily.regular,
//              fontSize: config.textSize,
//            }}>
//            32/50
//          </Text>
//        </View>
//      </View>
//      <View style={{justifyContent: 'flex-end'}}>
//        <FlatList
//          horizontal
//          keyExtractor={(item, index) => index.toString()}
//          data={data}
//          renderItem={renderItem}
//        />
//      </View>
//      {/* </ScrollView> */}
//    </SafeAreaView>
//  );
//};

//export default PhotoAttendance;

//const styles = StyleSheet.create({
//  preview: {
//    // flexDirection: 'row',
//    // justifyContent: 'flex-end',
//    height: '100%',
//    // alignItems: 'flex-end',
//    //flex: 1,
//    //flexDirection: 'row',
//    justifyContent: 'flex-end',
//    alignItems: 'center',
//    //zIndex: -1,
//    marginTop: 40,
//  },
//  capture: {
//    flex: 0,
//    width: 50,
//    height: 50,
//    backgroundColor: '#fff',
//    borderRadius: 25,
//    borderWidth: 3,
//    borderColor: 'white',
//    //padding: 15,

//    //paddingHorizontal: 20,
//    alignSelf: 'center',
//    //margin: 20,
//  },
//});

// import React, {Component} from 'react';
// import {SafeAreaView, BackHandler} from 'react-native';
// import {Image, TouchableOpacity} from 'react-native';
// import {ScrollView} from 'react-native';
// import {ImageBackground} from 'react-native';
// import {Dimensions} from 'react-native';
// import {FlatList} from 'react-native';
// import {StyleSheet} from 'react-native';
// import {View, Text} from 'react-native';
// import {RNCamera} from 'react-native-camera';
// import ResponsiveSize from '../config/ResponsiveSize';
// import {CustomHeader} from './CustomHeader';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Loader} from './Loader';
// import ImageSlider from 'react-native-image-slider';
// import ScreenOrientation, {
//   LANDSCAPE,
// } from 'react-native-orientation-locker/ScreenOrientation';
// import Orientation from 'react-native-orientation-locker';
// import moment from 'moment';
// import CameraComp from './CameraComp';
// import {Icon} from 'react-native-elements';

// const data = ['View 1', 'View 2', 'View 3', 'View 4', 'View 5', 'View 6'];
// let ScreenWidth = Dimensions.get('window').width;
// let ScreenHeight = Dimensions.get('window').height;

// export default class PhotoAttendance extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       Show: false,
//       photos: '',
//       collegeCode: '13',
//       images: [],
//       ScreenHeight: ScreenWidth,
//       ScreenWidth: ScreenHeight,
//       data: [],
//       item: this.props.route.params?.item || {},
//       studentCount: this.props.route.params?.studentCount || '0',
//       json: [],
//       students: [],
//       // studentCount:
//       //   (this.props.route.params && this.props.route.params.studentCount) ||
//       //   '0',
//     };
//   }
//   componentDidMount() {
//     this.retrieveData();
//     this.studentDetails();
//     this.backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       this.handleBackPress,
//     );
//   }

//   componentWillUnmount() {
//     this.backHandler.remove();
//   }

//   handleBackPress = () => {
//     // this.props.navigation.goBack(null);
//     return true;
//   };

//   studentDetails = async () => {
//     try {
//       const value = await AsyncStorage.getItem('token');
//       const configs = {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + value,
//           // Authorization:
//           //   'Bearer ' +
//           //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg3Y2JlMy00M2FlLTQzODYtODcyYS1jZWFkMmJlYTM1YTIiLCJVc2VyTmFtZSI6IjExMjMiLCJEQiI6ImFUNXV4ZGd2empUQ1IwaWhrSkV6YVcrWCpOTVVBcERMNUVPa1lnZHA5d0NCUk1YOWc3am5iTkdOdVVieUlmd0FRbG1rVkx4c0xPKnVVRWpBaHhkN3V2YVljZVY5UWhiaEVUZVc5Kk1BTzJydjVDY3BWK3hxMEJ6RHpuOEt4M2lZb3AzKzFXSDl5MzhDKkVmZUxBRXQ0V3djSThnZ2hFaFFaRUZ2TjlZcG9VdkUxaXo3eHhMUXRVSllabUwqd3FRS0k0b0VqZWtkSUNPOCo1ckpMYVRCUFl6cTFrVDZzZlQqVFQwa2d4YjRqeEg2OEQwSmlLK1QrT2orYXhjdXdDTDNNQ24yWjkreGkyeXRLUnplUjZpOXJ2eTYyYW1HdWVKTjJteEpoRHpUcmhyOTlKNXM1aGUqTFlYbzY3MWtNeHdYMkRHME9IaTErUFFMMzNKRndPMXZ5UT09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6InJhbWFiYWRyYW4iLCJ1c2VyX2NvZGUiOiIzMDkiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiIiwibmJmIjoxNjE2MTc1NDI2LCJleHAiOjE2MTYxODI2MjYsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ZiE5-dLDr7L33o_M64K5b9GuafauszbmJmNXW4hbgmQ',
//         },
//         body: JSON.stringify({
//           batchYear: this.state.item.batchYear,
//           degreeCode: this.state.item.degCode,
//           semester: this.state.item.sem.toString(),
//           section: this.state.item.sections,
//           subjectNo: this.state.item.subno.toString(),
//           attDate: moment(this.state.item.date, 'DD/MM/YYYY').format(
//             'YYYY-MM-DD',
//           ),
//           //attDate: new Date().toISOString(),
//           hour: this.state.item.hour.toString(),
//         }),
//       };
//       // console.log('body ==>',configs.body);
//       const response = await fetch(
//         'https://insproplus.com/erpv2api/api/staff/GetStudentDetails',
//         configs,
//       );
//       const json = await response.json();
//       console.log('JSON ==>', json);
//       this.setState({json});
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   retrieveData = async (key) => {
//     try {
//       const value = await AsyncStorage.getItem('token');
//       if (value !== null) {
//         this.setState({Token: value}, function () {});
//       }
//     } catch (error) {
//       this.setState({Loader: false});
//       alert('Error retrieving data');
//     }
//     try {
//       const collegeCode = await AsyncStorage.getItem('collegeCode');
//       //alert('collegeCode == ', collegeCode);
//       if (collegeCode !== null) {
//         this.setState({collegeCode: collegeCode}, function () {
//           console.log('college', collegeCode);
//         });
//       }
//     } catch (error) {
//       this.setState({Loader: false});
//       alert('Error retrieving data');
//     }
//   };
//   takePicture = async (camera) => {
//     const options = {quality: 0.5, base64: true};

//     //console.log('CAMERA', camera);
//     if (camera) {
//       this.setState({loader: true});
//       try {
//         const image = await camera.takePictureAsync(options);
//         //console.log('image===', image);
//         if (image.uri) {
//           this.setState({
//             photos: [
//               ...this.state.photos,
//               {
//                 image: image.base64,
//               },
//             ],
//             images: [...this.state.images, image.uri],
//           });
//           this.setState({loader: false});
//           //console.log('photos ==>', photos);
//         }
//       } catch (e) {
//         console.log(e);
//         this.setState({loader: false});
//       }
//     }
//   };

//   captureHandler = async () => {
//     this.setState({loader: true});
//     const token = await AsyncStorage.getItem('token');
//     const collegeCode = this.state.collegeCode;
//     let formData = new FormData();
//     formData.append('images', JSON.stringify(this.state.photos));
//     formData.append('collegecode', collegeCode.toString());
//     const configs = {
//       method: 'POST',
//       headers: {
//         Authorization: 'Bearer ' + token,
//         //   Authorization:
//         //     'Bearer ' +
//         //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg3Y2JlMy00M2FlLTQzODYtODcyYS1jZWFkMmJlYTM1YTIiLCJVc2VyTmFtZSI6IjExMjMiLCJEQiI6ImFUNXV4ZGd2empUQ1IwaWhrSkV6YVcrWCpOTVVBcERMNUVPa1lnZHA5d0NCUk1YOWc3am5iTkdOdVVieUlmd0FRbG1rVkx4c0xPKnVVRWpBaHhkN3V2YVljZVY5UWhiaEVUZVc5Kk1BTzJydjVDY3BWK3hxMEJ6RHpuOEt4M2lZb3AzKzFXSDl5MzhDKkVmZUxBRXQ0V3djSThnZ2hFaFFaRUZ2TjlZcG9VdkUxaXo3eHhMUXRVSllabUwqd3FRS0k0b0VqZWtkSUNPOCo1ckpMYVRCUFl6cTFrVDZzZlQqVFQwa2d4YjRqeEg2OEQwSmlLK1QrT2orYXhjdXdDTDNNQ24yWjkreGkyeXRLUnplUjZpOXJ2eTYyYW1HdWVKTjJteEpoRHpUcmhyOTlKNXM1aGUqTFlYbzY3MWtNeHdYMkRHME9IaTErUFFMMzNKRndPMXZ5UT09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6InJhbWFiYWRyYW4iLCJ1c2VyX2NvZGUiOiIzMDkiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiIiwibmJmIjoxNjE2MTc1NDI2LCJleHAiOjE2MTYxODI2MjYsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ZiE5-dLDr7L33o_M64K5b9GuafauszbmJmNXW4hbgmQ',
//       },
//       body: formData,
//     };
//     try {
//       const response = await fetch(
//         'http://103.87.172.204:5692/api/v1/student/validate/face',
//         configs,
//       );

//       console.log('esp', JSON.stringify(response, null, 4));
//       const json = await response.json();

//       let students = [];
//       json.status.forEach((appNo) => {
//         this.state.json.forEach((el, i) => {
//           if (el.appNo === appNo) {
//             students.push(el);
//           }
//         });
//       });
//       console.log('STUDENTS ==>', students);
//       this.setState({students}, () => {
//         //alert('Total Students Present - ' + students.length.toString())
//         alert('Students: ' + JSON.stringify(students));
//       });

//       //console.log('JSON', json);
//       this.setState({loader: false, data: json.status});
//     } catch (e) {
//       console.log(e);
//       this.setState({Show: false, loader: false});
//       alert('No student present');
//       return setTimeout(
//         //() => this.props.navigation.navigate('FaceRegister'),
//         () => this.props.navigation.goBack(),
//         800,
//       );
//     }
//   };

//   submitHandler = async () => {
//     this.setState({loader: true});
//     let body = [];
//     const token = await AsyncStorage.getItem('token');
//     this.state.students.forEach((student) => {
//       body.push({
//         registratioNumber: student.registrationNo,
//         hour: Number(this.state.item.hour),
//         date: moment(this.state.item.date, 'DD/MM/YYYY').format(
//           'YYYY-MM-DDTHH:mm:ss.SSS',
//         ),
//         attVal: '1',
//       });
//     });
//     if (body.length > 0) {
//       this.markAttendance(body, token).then((resp) => {
//         this.setState({loader: false});
//         if (resp) {
//           alert(
//             `Attendance marked successfully of ${body.length.toString()} student(s)`,
//           );
//           return this.props.navigation.goBack();
//         }
//         this.setState({images: [], Show: false, students: []});
//         alert(
//           'Unhandled exception occured while marking attendance. Please try again.',
//         );
//       });
//     }
//   };
//   markAttendance = async (body, token) => {
//     try {
//       const configs = {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + token,
//           // Authorization:
//           //   'Bearer ' +
//           //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg3Y2JlMy00M2FlLTQzODYtODcyYS1jZWFkMmJlYTM1YTIiLCJVc2VyTmFtZSI6IjExMjMiLCJEQiI6ImFUNXV4ZGd2empUQ1IwaWhrSkV6YVcrWCpOTVVBcERMNUVPa1lnZHA5d0NCUk1YOWc3am5iTkdOdVVieUlmd0FRbG1rVkx4c0xPKnVVRWpBaHhkN3V2YVljZVY5UWhiaEVUZVc5Kk1BTzJydjVDY3BWK3hxMEJ6RHpuOEt4M2lZb3AzKzFXSDl5MzhDKkVmZUxBRXQ0V3djSThnZ2hFaFFaRUZ2TjlZcG9VdkUxaXo3eHhMUXRVSllabUwqd3FRS0k0b0VqZWtkSUNPOCo1ckpMYVRCUFl6cTFrVDZzZlQqVFQwa2d4YjRqeEg2OEQwSmlLK1QrT2orYXhjdXdDTDNNQ24yWjkreGkyeXRLUnplUjZpOXJ2eTYyYW1HdWVKTjJteEpoRHpUcmhyOTlKNXM1aGUqTFlYbzY3MWtNeHdYMkRHME9IaTErUFFMMzNKRndPMXZ5UT09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6InJhbWFiYWRyYW4iLCJ1c2VyX2NvZGUiOiIzMDkiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiIiwibmJmIjoxNjE2MTc1NDI2LCJleHAiOjE2MTYxODI2MjYsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ZiE5-dLDr7L33o_M64K5b9GuafauszbmJmNXW4hbgmQ',
//         },
//         body: JSON.stringify(body),
//       };
//       const response = await fetch(
//         'https://insproplus.com/erpv2api/api/staff/MarkAttendanceOfStudentOfParticularClass',
//         configs,
//       );
//       const json = await response.json();

//       if (json.status) {
//         return true;
//       } else {
//         return false;
//       }

//       //console.log('JSON', json);
//     } catch (e) {
//       return false;
//     }
//   };

//   render() {
//     const styles = StyleSheet.create({
//       MainImageView: {
//         width: '95%',
//         alignSelf: 'center',
//         borderRadius: 15,
//         height: ScreenHeight * 0.5,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'yellow',
//         //marginVertical: 10,
//       },
//       SmallPicsStyle: {
//         borderRadius: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: 30,
//         width: 60,
//         marginHorizontal: 3,
//         marginVertical: 20,
//       },
//       preview: {
//         // height: '100%',
//         flex: 1,
//         //height: ResponsiveSize(150),
//         // width: '120%',
//         //alignSelf: 'center',
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//         // paddingBop: '40%',
//         borderColor: 'transparent',
//         //borderWidth: 90,
//         zIndex: -100,
//         // overflow: 'hidden',
//         //borderBottomWidth: 60,
//         //borderTopWidth: 30,
//         //marginVertical: 40,
//       },
//       capture: {
//         flex: 0,
//         width: 50,
//         height: 50,
//         backgroundColor: '#fff',
//         borderRadius: 25,
//         borderWidth: 3,
//         //marginTop: 100,
//         //left: 260,
//         zIndex: 100,
//         // position: 'absolute',
//         // bottom: -50,
//         // left: 100,
//         //top: this.state.ScreenHeight * 0.6,
//         //top: '100%',
//         justifyContent: 'flex-end',
//         borderColor: 'white',
//         alignSelf: 'center',
//         marginTop: 100,
//         marginRight: 30,
//       },
//     });

//     return (
//       <SafeAreaView>
//         <CustomHeader
//           isHome={false}
//           title={'Photo Attendance'}
//           navigation={this.props.navigation}
//           changeOrientation
//         />

//         <Loader Loading={this.state.loader} />
//         {this.state.Show ? (
//           <View style={styles.MainImageView}>
//             <ImageSlider
//               style={{width: '100%'}}
//               images={this.state.images}
//               ref={(ref) => (this.input = ref)}
//             />
//           </View>
//         ) : (
//           // </View>
//           // <View
//           //   style={{
//           //     width: '100%',
//           //     flex: 1,
//           //     //width: this.state.ScreenWidth * 0.8,
//           //     //height: this.state.ScreenHeight * 0.6,
//           //     //backgroundColor: 'yellow',
//           //   }}>
//           //   {/* <ScreenOrientation orientation={LANDSCAPE} /> */}
//           //   <View
//           //     style={{
//           //       width: '100%',
//           //       flex: 1,
//           //       //backgroundColor: '#ccc',
//           //       //backgroundColor: 'blue',
//           //     }}>
//           //     <RNCamera
//           //       style={styles.preview}
//           //       type={RNCamera.Constants.Type.back}
//           //       flashMode={RNCamera.Constants.FlashMode.auto}
//           //       androidCameraPermissionOptions={{
//           //         title: 'Permission to use camera',
//           //         message: 'We need your permission to use your camera',
//           //         buttonPositive: 'Ok',
//           //         buttonNegative: 'Cancel',
//           //       }}>
//           //       {({camera, status, recordAudioPermissionStatus}) => {
//           //         // if (status === 'READY') {
//           //         //   setState({...state, camera});
//           //         // }
//           //         console.log('Status', status);
//           //         if (status !== 'READY') return <View />;
//           //         return (
//           //           <TouchableOpacity
//           //             onPress={() => this.takePicture(camera)}
//           //             style={styles.capture}>
//           //             {/* <Text style={{fontSize: 14}}> SNAP </Text> */}
//           //           </TouchableOpacity>
//           //         );
//           //       }}
//           //     </RNCamera>
//           //   </View>
//           // </View>
//           <CameraComp
//             onPress={(camera) => this.takePicture(camera)}
//             // btnText={'Capture'}
//             onClose={() =>
//               this.setState({
//                 Show: this.state.images.length > 0 ? true : false,
//               })
//             }
//           />
//         )}

//         <ScrollView horizontal>
//           <View
//             style={{
//               flexDirection: 'row',
//               justifyContent: 'space-around',
//               alignSelf: 'center',
//               marginTop: 10,
//             }}>
//             {this.state.images.map((image, index) => {
//               return (
//                 <View
//                   style={{
//                     flexDirection: 'row',
//                     justifyContent: 'center',
//                     //alignItems: 'center',
//                   }}
//                   key={index}>
//                   <View style={{alignSelf: 'center'}}>
//                     <ImageBackground
//                       borderRadius={30}
//                       resizeMode="stretch"
//                       style={styles.SmallPicsStyle}
//                       source={require('../assets/studentsPic.png')}>
//                       <TouchableOpacity
//                         onPress={() => {
//                           this.input._move(index);
//                         }}
//                         style={[
//                           styles.SmallPicsStyle,
//                           {backgroundColor: 'rgba(0,0,0,0.5)', width: '100%'},
//                         ]}>
//                         <Text style={{color: 'white'}}>
//                           {`View ${index + 1}`}
//                         </Text>
//                       </TouchableOpacity>
//                     </ImageBackground>
//                   </View>
//                   <View style={{position: 'absolute', bottom: 0, right: 0}}>
//                     <Icon
//                       //raised
//                       name="delete"
//                       size={20}
//                       type="material"
//                       color="#f50"
//                       onPress={() => {
//                         const newImages = this.state.images.filter(
//                           (im, i) => i !== index,
//                         );
//                         this.setState({images: newImages});
//                       }}
//                     />
//                   </View>
//                   {/* <Icon
//                     //raised
//                     name="delete"
//                     size={10}
//                     type="antdesign"
//                     color="#f50"
//                     onPress={() => {
//                       const newImages = this.state.images.filter(
//                         (im, i) => i !== index,
//                       );
//                       this.setState({images: newImages});
//                     }}
//                   /> */}
//                 </View>
//               );
//             })}
//           </View>
//         </ScrollView>

//         <View
//           style={{
//             width: '100%',
//             //height: 60,
//             alignItems: 'center',
//             justifyContent: 'space-between',
//             marginBottom: 20,
//             //backgroundColor: 'red',

//             flexDirection: 'row',
//           }}>
//           {this.state.images.length > 0 && (
//             <View
//               style={{
//                 width: '20%',
//                 // height: 60,
//                 paddingVertical: 10,
//                 justifyContent: 'center',
//                 marginLeft: 40,
//               }}>
//               <ImageBackground
//                 borderRadius={30}
//                 resizeMode="stretch"
//                 style={styles.SmallPicsStyle}
//                 source={
//                   !this.state.Show
//                     ? require('../assets/studentsPic.png')
//                     : require('../assets/cameraWhite.png')
//                 }>
//                 <TouchableOpacity
//                   onPress={() => {
//                     this.setState({Show: !this.state.Show});
//                   }}
//                   style={[
//                     styles.SmallPicsStyle,
//                     {backgroundColor: 'rgba(0,0,0,0.5)', width: 100},
//                   ]}>
//                   <Text style={{color: 'white'}}>
//                     {!this.state.Show ? 'View Images' : 'Open Camera'}
//                   </Text>
//                 </TouchableOpacity>
//               </ImageBackground>
//             </View>
//           )}

//           {this.state.Show && this.state.students.length === 0 && (
//             <TouchableOpacity
//               onPress={() => {
//                 this.captureHandler();
//               }}
//               style={[
//                 styles.SmallPicsStyle,
//                 {
//                   //backgroundColor: 'rgba(0,0,0,0.25)',
//                   backgroundColor: '#120E66',
//                   borderRadius: 10,
//                   width: '20%',
//                   //position: 'absolute',
//                   //bottom: -20,
//                   //right: -130,
//                 },
//               ]}>
//               <Text style={{color: 'white'}}>Upload</Text>
//             </TouchableOpacity>
//           )}
//           {this.state.students.length > 0 && (
//             <TouchableOpacity
//               onPress={() => {
//                 this.submitHandler();
//               }}
//               style={[
//                 styles.SmallPicsStyle,
//                 {
//                   //backgroundColor: 'rgba(0,0,0,0.25)',
//                   backgroundColor: '#120E66',
//                   borderRadius: 10,
//                   width: '20%',
//                   //position: 'absolute',
//                   //bottom: -20,
//                   //right: -130,
//                 },
//               ]}>
//               <Text style={{color: 'white'}}>Submit</Text>
//             </TouchableOpacity>
//           )}
//           {this.state.students.length > 0 && (
//             <View
//               style={[
//                 styles.SmallPicsStyle,
//                 {
//                   backgroundColor: '#120E66',
//                   borderRadius: 10,

//                   height: 50,
//                   alignItems: 'flex-start',
//                   justifyContent: 'space-between',
//                   padding: 5,
//                   //marginRight: 10,
//                   width: '20%',
//                   // position: 'absolute',
//                   // bottom: -30,
//                   // right: -50,
//                 },
//               ]}>
//               <Text style={{color: 'white'}}>
//                 {this.state.students.length.toString()}
//               </Text>
//               <View
//                 style={{
//                   width: '100%',
//                   height: 1,
//                   backgroundColor: 'gray',
//                 }}></View>
//               <Text style={{alignSelf: 'flex-end', color: 'white'}}>
//                 {this.state.studentCount}
//               </Text>
//             </View>
//           )}
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

/////////////////////////////////

// import React, {Component} from 'react';
// import {SafeAreaView, BackHandler} from 'react-native';
// import {Image, TouchableOpacity} from 'react-native';
// import {ScrollView} from 'react-native';
// import {ImageBackground} from 'react-native';
// import {Dimensions} from 'react-native';
// import {FlatList} from 'react-native';
// import {StyleSheet} from 'react-native';
// import {View, Text} from 'react-native';
// import {RNCamera} from 'react-native-camera';
// import ResponsiveSize from '../config/ResponsiveSize';
// import {CustomHeader} from './CustomHeader';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {Loader} from './Loader';
// import ImageSlider from 'react-native-image-slider';
// import ScreenOrientation, {
//   LANDSCAPE,
// } from 'react-native-orientation-locker/ScreenOrientation';
// import Orientation from 'react-native-orientation-locker';
// import moment from 'moment';
// import CameraComp from './CameraComp';
// import {Icon} from 'react-native-elements';

// const data = ['View 1', 'View 2', 'View 3', 'View 4', 'View 5', 'View 6'];
// let ScreenWidth = Dimensions.get('window').width;
// let ScreenHeight = Dimensions.get('window').height;

// export default class PhotoAttendance extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       Show: false,
//       photos: '',
//       collegeCode: '13',
//       images: [],
//       ScreenHeight: ScreenHeight > ScreenWidth ? ScreenWidth : ScreenHeight,
//       ScreenWidth: ScreenHeight > ScreenWidth ? ScreenHeight : ScreenWidth,
//       data: [],
//       item: this.props.route.params?.item || {},
//       studentCount: this.props.route.params?.studentCount || '0',
//       json: [],
//       // studentCount:
//       //   (this.props.route.params && this.props.route.params.studentCount) ||
//       //   '0',
//     };
//   }
//   componentDidMount() {
//     this.retrieveData();
//     this.studentDetails();
//     this.backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       this.handleBackPress,
//     );
//   }

//   componentWillUnmount() {
//     this.backHandler.remove();
//   }

//   handleBackPress = () => {
//     // this.props.navigation.goBack(null);
//     return true;
//   };

//   studentDetails = async () => {
//     try {
//       const value = await AsyncStorage.getItem('token');
//       const configs = {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + value,
//           // Authorization:
//           //   'Bearer ' +
//           //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg3Y2JlMy00M2FlLTQzODYtODcyYS1jZWFkMmJlYTM1YTIiLCJVc2VyTmFtZSI6IjExMjMiLCJEQiI6ImFUNXV4ZGd2empUQ1IwaWhrSkV6YVcrWCpOTVVBcERMNUVPa1lnZHA5d0NCUk1YOWc3am5iTkdOdVVieUlmd0FRbG1rVkx4c0xPKnVVRWpBaHhkN3V2YVljZVY5UWhiaEVUZVc5Kk1BTzJydjVDY3BWK3hxMEJ6RHpuOEt4M2lZb3AzKzFXSDl5MzhDKkVmZUxBRXQ0V3djSThnZ2hFaFFaRUZ2TjlZcG9VdkUxaXo3eHhMUXRVSllabUwqd3FRS0k0b0VqZWtkSUNPOCo1ckpMYVRCUFl6cTFrVDZzZlQqVFQwa2d4YjRqeEg2OEQwSmlLK1QrT2orYXhjdXdDTDNNQ24yWjkreGkyeXRLUnplUjZpOXJ2eTYyYW1HdWVKTjJteEpoRHpUcmhyOTlKNXM1aGUqTFlYbzY3MWtNeHdYMkRHME9IaTErUFFMMzNKRndPMXZ5UT09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6InJhbWFiYWRyYW4iLCJ1c2VyX2NvZGUiOiIzMDkiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiIiwibmJmIjoxNjE2MTc1NDI2LCJleHAiOjE2MTYxODI2MjYsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ZiE5-dLDr7L33o_M64K5b9GuafauszbmJmNXW4hbgmQ',
//         },
//         body: JSON.stringify({
//           batchYear: this.state.item.batchYear,
//           degreeCode: this.state.item.degCode,
//           semester: this.state.item.sem.toString(),
//           section: this.state.item.sections,
//           subjectNo: this.state.item.subno.toString(),
//           attDate: moment(this.state.item.date, 'DD/MM/YYYY').format(
//             'YYYY-MM-DD',
//           ),
//           //attDate: new Date().toISOString(),
//           hour: this.state.item.hour.toString(),
//         }),
//       };
//       // console.log('body ==>',configs.body);
//       const response = await fetch(
//         'https://insproplus.com/erpv2api/api/staff/GetStudentDetails',
//         configs,
//       );
//       const json = await response.json();
//       console.log('JSON ==>', json);
//       this.setState({json});
//     } catch (e) {
//       console.log(e);
//     }
//   };

//   retrieveData = async (key) => {
//     console.log(
//       'width',
//       this.state.ScreenWidth,
//       ScreenWidth,
//       'height',
//       this.state.ScreenHeight,
//       ScreenHeight,
//     );
//     try {
//       const value = await AsyncStorage.getItem('token');
//       if (value !== null) {
//         this.setState({Token: value}, function () {});
//       }
//     } catch (error) {
//       this.setState({Loader: false});
//       alert('Error retrieving data');
//     }
//     try {
//       const collegeCode = await AsyncStorage.getItem('collegeCode');
//       //alert('collegeCode == ', collegeCode);
//       if (collegeCode !== null) {
//         this.setState({collegeCode: collegeCode}, function () {
//           console.log('college', collegeCode);
//         });
//       }
//     } catch (error) {
//       this.setState({Loader: false});
//       alert('Error retrieving data');
//     }
//   };
//   takePicture = async (camera) => {
//     const options = {quality: 0.5, base64: true};

//     //console.log('CAMERA', camera);
//     if (camera) {
//       this.setState({loader: true});
//       try {
//         const image = await camera.takePictureAsync(options);
//         //console.log('image===', image);
//         if (image.uri) {
//           this.setState({
//             photos: [
//               ...this.state.photos,
//               {
//                 image: image.base64,
//               },
//             ],
//             images: [...this.state.images, image.uri],
//           });
//           this.setState({loader: false});
//           //console.log('photos ==>', photos);
//         }
//       } catch (e) {
//         console.log(e);
//         this.setState({loader: false});
//       }
//     }
//   };

//   captureHandler = async () => {
//     this.setState({loader: true});
//     const token = await AsyncStorage.getItem('token');
//     const collegeCode = this.state.collegeCode;
//     let formData = new FormData();
//     formData.append('images', JSON.stringify(this.state.photos));
//     formData.append('collegecode', collegeCode.toString());
//     const configs = {
//       method: 'POST',
//       headers: {
//         Authorization: 'Bearer ' + token,
//         //   Authorization:
//         //     'Bearer ' +
//         //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg3Y2JlMy00M2FlLTQzODYtODcyYS1jZWFkMmJlYTM1YTIiLCJVc2VyTmFtZSI6IjExMjMiLCJEQiI6ImFUNXV4ZGd2empUQ1IwaWhrSkV6YVcrWCpOTVVBcERMNUVPa1lnZHA5d0NCUk1YOWc3am5iTkdOdVVieUlmd0FRbG1rVkx4c0xPKnVVRWpBaHhkN3V2YVljZVY5UWhiaEVUZVc5Kk1BTzJydjVDY3BWK3hxMEJ6RHpuOEt4M2lZb3AzKzFXSDl5MzhDKkVmZUxBRXQ0V3djSThnZ2hFaFFaRUZ2TjlZcG9VdkUxaXo3eHhMUXRVSllabUwqd3FRS0k0b0VqZWtkSUNPOCo1ckpMYVRCUFl6cTFrVDZzZlQqVFQwa2d4YjRqeEg2OEQwSmlLK1QrT2orYXhjdXdDTDNNQ24yWjkreGkyeXRLUnplUjZpOXJ2eTYyYW1HdWVKTjJteEpoRHpUcmhyOTlKNXM1aGUqTFlYbzY3MWtNeHdYMkRHME9IaTErUFFMMzNKRndPMXZ5UT09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6InJhbWFiYWRyYW4iLCJ1c2VyX2NvZGUiOiIzMDkiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiIiwibmJmIjoxNjE2MTc1NDI2LCJleHAiOjE2MTYxODI2MjYsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ZiE5-dLDr7L33o_M64K5b9GuafauszbmJmNXW4hbgmQ',
//       },
//       body: formData,
//     };
//     try {
//       const response = await fetch(
//         'http://103.87.172.204:5692/api/v1/student/validate/face',
//         configs,
//       );

//       console.log('esp', JSON.stringify(response, null, 4));
//       const json = await response.json();
//       console.log('JSON ==>', json);
//       let body = [];
//       let students = [];
//       json.status.forEach((appNo) => {
//         this.state.json.forEach((el, i) => {
//           if (el.appNo === appNo) {
//             students.push(el);
//           }
//         });
//       });
//       console.log('STUDENTS ==>', students);
//       if (students.length === 0) {
//         return alert('No students present');
//       }
//       students.forEach((student) => {
//         body.push({
//           registratioNumber: student.registrationNo,
//           hour: Number(this.state.item.hour),
//           date: moment(this.state.item.date, 'DD/MM/YYYY').format(
//             'YYYY-MM-DDTHH:mm:ss.SSS',
//           ),
//           attVal: '1',
//         });
//       });
//       if (body.length > 0) {
//         this.markAttendance(body, token).then((resp) => {
//           if (resp) {
//             return alert(
//               `Total Student Present - ${json.status.length.toString()}`,
//             );
//           }
//           alert(
//             'Unhandled exception occured while marking attendance. Please try again.',
//           );
//         });
//       }
//       console.log('JSON', json);
//       this.setState({Show: false, loader: false, data: json.status});
//     } catch (e) {
//       console.log(e);
//       this.setState({Show: false, loader: false});
//       alert('No student present');
//       return setTimeout(
//         //() => this.props.navigation.navigate('FaceRegister'),
//         () => this.props.navigation.goBack(),
//         800,
//       );
//     }
//   };

//   markAttendance = async (body, token) => {
//     this.setState({loader: true});
//     try {
//       const configs = {
//         method: 'POST',
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json',
//           Authorization: 'Bearer ' + token,
//           // Authorization:
//           //   'Bearer ' +
//           //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg3Y2JlMy00M2FlLTQzODYtODcyYS1jZWFkMmJlYTM1YTIiLCJVc2VyTmFtZSI6IjExMjMiLCJEQiI6ImFUNXV4ZGd2empUQ1IwaWhrSkV6YVcrWCpOTVVBcERMNUVPa1lnZHA5d0NCUk1YOWc3am5iTkdOdVVieUlmd0FRbG1rVkx4c0xPKnVVRWpBaHhkN3V2YVljZVY5UWhiaEVUZVc5Kk1BTzJydjVDY3BWK3hxMEJ6RHpuOEt4M2lZb3AzKzFXSDl5MzhDKkVmZUxBRXQ0V3djSThnZ2hFaFFaRUZ2TjlZcG9VdkUxaXo3eHhMUXRVSllabUwqd3FRS0k0b0VqZWtkSUNPOCo1ckpMYVRCUFl6cTFrVDZzZlQqVFQwa2d4YjRqeEg2OEQwSmlLK1QrT2orYXhjdXdDTDNNQ24yWjkreGkyeXRLUnplUjZpOXJ2eTYyYW1HdWVKTjJteEpoRHpUcmhyOTlKNXM1aGUqTFlYbzY3MWtNeHdYMkRHME9IaTErUFFMMzNKRndPMXZ5UT09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6InJhbWFiYWRyYW4iLCJ1c2VyX2NvZGUiOiIzMDkiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiIiwibmJmIjoxNjE2MTc1NDI2LCJleHAiOjE2MTYxODI2MjYsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ZiE5-dLDr7L33o_M64K5b9GuafauszbmJmNXW4hbgmQ',
//         },
//         body: JSON.stringify(body),
//       };
//       const response = await fetch(
//         'https://insproplus.com/erpv2api/api/staff/MarkAttendanceOfStudentOfParticularClass',
//         configs,
//       );
//       const json = await response.json();

//       if (json.status) {
//         return true;
//       } else {
//         return false;
//       }

//       //console.log('JSON', json);
//     } catch (e) {
//       return false;
//     }
//   };
//   move = (index) => {
//     console.log('index', index);
//     this.input._move(index);
//   };

//   render() {
//     const styles = StyleSheet.create({
//       MainImageView: {
//         width: '95%',
//         alignSelf: 'center',
//         borderRadius: 15,
//         //flex: 1,
//         height: ScreenHeight * 0.5,
//         justifyContent: 'center',
//         alignItems: 'center',
//         //marginVertical: 10,
//       },
//       SmallPicsStyle: {
//         borderRadius: 30,
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: 30,
//         width: 60,
//         marginHorizontal: 3,
//         marginVertical: 20,
//       },
//       preview: {
//         //height: '40%',
//         //height: ResponsiveSize(150),
//         flex: 1,
//         width: '100%',
//         //alignSelf: 'center',
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//         // paddingBop: '40%',
//         borderColor: 'transparent',
//         //borderWidth: 90,
//         zIndex: -100,
//         overflow: 'hidden',
//         //borderBottomWidth: 60,
//         //borderTopWidth: 30,
//         //marginVertical: 40,
//       },
//       capture: {
//         flex: 0,
//         width: 50,
//         height: 50,
//         backgroundColor: '#fff',
//         borderRadius: 25,
//         borderWidth: 3,
//         //marginTop: 100,
//         //left: 260,
//         zIndex: 100,
//         // position: 'absolute',
//         // bottom: -50,
//         // left: 100,
//         //top: this.state.ScreenHeight * 0.6,
//         //top: '100%',
//         justifyContent: 'flex-end',
//         borderColor: 'white',
//         alignSelf: 'center',
//         marginTop: 100,
//         marginRight: 30,
//       },
//     });

//     return (
//       <SafeAreaView>
//         <CustomHeader
//           isHome={false}
//           title={''}
//           navigation={this.props.navigation}
//           changeOrientation
//         />

//         <Loader Loading={this.state.loader} />
//         <View style={{flex: 1, marginBottom: 270}}>
//           <View style={styles.MainImageView}>
//             {this.state.Show ? (
//               <ImageSlider
//                 images={this.state.images}
//                 ref={(ref) => (this.input = ref)}
//               />
//             ) : (
//               <CameraComp
//                 onPress={(camera) => this.takePicture(camera)}
//                 btnText={'Capture'}
//                 onClose={() =>
//                   this.setState({
//                     Show: this.state.images.length > 0 ? true : false,
//                   })
//                 }
//               />
//             )}
//           </View>
//           <View
//             style={{
//               width: '100%',
//               //height: 60,
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               marginBottom: 20,
//               //backgroundColor: 'red',

//               flexDirection: 'row',
//             }}>
//             {this.state.images.length > 0 && (
//               <View
//                 style={{
//                   width: 200,
//                   height: 60,
//                   paddingVertical: 10,
//                   justifyContent: 'center',
//                   marginLeft: 40,
//                 }}>
//                 <ImageBackground
//                   borderRadius={30}
//                   resizeMode="stretch"
//                   style={styles.SmallPicsStyle}
//                   source={
//                     !this.state.Show
//                       ? require('../assets/studentsPic.png')
//                       : require('../assets/cameraWhite.png')
//                   }>
//                   <TouchableOpacity
//                     onPress={() => {
//                       this.setState({Show: !this.state.Show});
//                     }}
//                     style={[
//                       styles.SmallPicsStyle,
//                       {backgroundColor: 'rgba(0,0,0,0.5)', width: 100},
//                     ]}>
//                     <Text style={{color: 'white'}}>
//                       {!this.state.Show ? 'View Images' : 'Open Camera'}
//                     </Text>
//                   </TouchableOpacity>
//                 </ImageBackground>
//               </View>
//             )}

//             {this.state.Show && (
//               <TouchableOpacity
//                 onPress={() => {
//                   this.captureHandler();
//                 }}
//                 style={[
//                   styles.SmallPicsStyle,
//                   {
//                     //backgroundColor: 'rgba(0,0,0,0.25)',
//                     backgroundColor: '#120E66',
//                     borderRadius: 10,
//                     //position: 'absolute',
//                     //bottom: -20,
//                     //right: -130,
//                   },
//                 ]}>
//                 <Text style={{color: 'white'}}>Save</Text>
//               </TouchableOpacity>
//             )}
//             {this.state.data.length > 0 && (
//               <View
//                 style={[
//                   styles.SmallPicsStyle,
//                   {
//                     backgroundColor: '#120E66',
//                     borderRadius: 10,
//                     height: 50,
//                     alignItems: 'flex-start',
//                     justifyContent: 'space-between',
//                     padding: 5,
//                     // position: 'absolute',
//                     // bottom: -30,
//                     // right: -50,
//                   },
//                 ]}>
//                 <Text style={{color: 'white'}}>
//                   {this.state.data.length.toString()}
//                 </Text>
//                 <View
//                   style={{
//                     width: '100%',
//                     height: 1,
//                     backgroundColor: 'gray',
//                   }}></View>
//                 <Text style={{alignSelf: 'flex-end', color: 'white'}}>
//                   {this.state.studentCount}
//                 </Text>
//               </View>
//             )}
//           </View>

//           {this.state.Show && (
//             <FlatList
//               data={this.state.images}
//               //horizontal
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({image, index}) => {
//                 return (
//                   <View
//                     style={{
//                       flexDirection: 'row',
//                       width: '40%',
//                       justifyContent: 'space-between',
//                       alignItems: 'center',
//                       alignSelf: 'center',
//                     }}>
//                     <ImageBackground
//                       borderRadius={30}
//                       resizeMode="stretch"
//                       style={styles.SmallPicsStyle}
//                       source={require('../assets/studentsPic.png')}>
//                       <TouchableOpacity
//                         onPress={() => {
//                           this.move(index);
//                         }}
//                         style={[
//                           styles.SmallPicsStyle,
//                           {backgroundColor: 'rgba(0,0,0,0.5)'},
//                         ]}>
//                         <Text style={{color: 'white'}}>
//                           {`View ${index + 1}`}
//                         </Text>
//                       </TouchableOpacity>
//                     </ImageBackground>
//                     <Icon
//                       raised
//                       name="delete"
//                       type="antdesign"
//                       color="#f50"
//                       onPress={() => console.log('hello')}
//                     />
//                   </View>
//                 );
//               }}
//             />
//           )}
//         </View>
//       </SafeAreaView>
//     );
//   }
// }

import React, {Component} from 'react';
import {Text, View} from 'react-native';
import CameraComp from './CameraComp';

export class PhotoAttendance extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <CameraComp
        item={this.props.route?.params?.item || {}}
        navigation={this.props.navigation}
      />
    );
  }
}

export default PhotoAttendance;
