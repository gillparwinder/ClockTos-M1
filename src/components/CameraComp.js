// import {Row} from 'native-base';
// import React from 'react';
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Modal,
//   Dimensions,
//   Image,
// } from 'react-native';
// import {RNCamera} from 'react-native-camera';
// import {Icon} from 'react-native-elements';
// import config from '../config/config';

// const CameraComp = (props) => {
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       flexDirection: 'column',
//       zIndex: 1,
//     },
//     preview: {
//       flex: 1,
//     },
//     capture: {
//       flex: 0,
//       width: Dimensions.get('screen').width * 0.2,
//       height: Dimensions.get('screen').height * 0.09,
//       borderRadius: Dimensions.get('screen').height * 0.2,
//       backgroundColor: 'white',
//       position: 'absolute',
//       bottom: '45%',
//       borderWidth: 4,
//       borderColor: 'transparent',
//       right: '20%',
//       //padding: 15,
//       //paddingHorizontal: 20,
//       alignSelf: 'center',
//       justifyContent: 'flex-end',
//       alignItems: 'center',
//     },
//   });
//   return (
//     <Modal
//       visible={props.visible}
//       onRequestClose={props.onClose}
//       onDismiss={props.onClose}
//       statusBarTranslucent={true}
//       style={styles.container}>
//       <RNCamera
//         style={styles.preview}
//         type={RNCamera.Constants.Type.back}
//         flashMode={RNCamera.Constants.FlashMode.auto}
//         androidCameraPermissionOptions={{
//           title: 'Permission to use camera',
//           message: 'We need your permission to use your camera',
//           buttonPositive: 'Ok',
//           buttonNegative: 'Cancel',
//         }}>
//         {({camera, status}) => {
//           if (status !== 'READY') return <Text>Waiting</Text>;
//           return (
//             <>
//               <View
//                 style={{
//                   flex: 1,
//                   //flexDirection: 'row',
//                   //justifyContent: 'flex-end',
//                   alignSelf: 'center',
//                 }}>
//                 {/* <Row>
//                   <View
//                     style={{
//                       width: 30,
//                       //height: 1200,
//                       backgroundColor: config.themeColor,
//                       marginRight: Dimensions.get('window').width - 30,
//                     }}></View>
//                   <View
//                     style={{
//                       width: 30,
//                       //height: '100%',
//                       backgroundColor: config.themeColor,
//                     }}></View>
//                 </Row> */}
//                 <View
//                   style={{marginTop: 20, position: 'absolute', left: '30%'}}>
//                   <Icon
//                     name="arrow-up"
//                     type="entypo"
//                     color="white"
//                     size={40}
//                     onPress={props.onClose}
//                   />
//                 </View>
//                 <TouchableOpacity
//                   onPress={() => props.onPress(camera)}
//                   style={styles.capture}
//                   disabled={props.pressed}>
//                   <Text
//                     style={{
//                       fontSize: 17,
//                       color: 'white',
//                       textTransform: 'uppercase',
//                       letterSpacing: 2,
//                       fontFamily: 'Poppins-Regular',
//                       fontWeight: 'bold',
//                     }}>
//                     {' '}
//                     {props.btnText}{' '}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </>
//           );
//         }}
//       </RNCamera>
//     </Modal>
//   );
// };
// export default CameraComp;

/************************************** */

import React from 'react';
import {RNCamera} from 'react-native-camera';
import {Icon, Overlay} from 'react-native-elements';
import {Col, Row, Grid} from 'react-native-easy-grid';
var moment = require('moment');
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Loader} from './Loader';
import {CustomButton} from './common/Button';
import config from '../config/config';
import CustomFastImage from './common/CustomFastImage';

const {width: winWidth, height: winHeight} = Dimensions.get('window');

const Gallery = ({captures = [], openImage}) => (
  <ScrollView
    horizontal={true}
    style={[styles.bottomToolbar, styles.galleryContainer]}>
    {captures.map(({uri}, index) => (
      <TouchableOpacity
        onPress={(index) => openImage(index)}
        style={styles.galleryImageContainer}
        key={uri}>
        <CustomFastImage
          resizeMode={'contain'}
          source={{uri}}
          style={styles.galleryImage}
        />
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const {FlashMode: CameraFlashModes, Type: CameraTypes} = RNCamera.Constants;

const Toolbar = ({
  capturing = false,
  flashMode = CameraFlashModes.off,
  setFlashMode,
  uploadHandler,
  onShortCapture,
}) => (
  <Grid style={styles.bottomToolbar}>
    <Row>
      <Col style={styles.alignCenter}>
        <TouchableOpacity
          onPress={() =>
            setFlashMode(
              flashMode === CameraFlashModes.on
                ? CameraFlashModes.off
                : CameraFlashModes.on,
            )
          }>
          <Icon
            name={
              flashMode == CameraFlashModes.on ? 'md-flash' : 'md-flash-off'
            }
            color="white"
            size={30}
            type="ionicon"
          />
        </TouchableOpacity>
      </Col>
      <Col size={2} style={styles.alignCenter}>
        <TouchableOpacity onPress={onShortCapture}>
          <View
            style={[styles.captureBtn, capturing && styles.captureBtnActive]}>
            {capturing && <View style={styles.captureBtnInternal} />}
          </View>
        </TouchableOpacity>
      </Col>
      <Col style={styles.alignCenter}>
        <TouchableOpacity onPress={uploadHandler}>
          <Icon name="md-cloud-upload" color="white" size={30} type="ionicon" />
        </TouchableOpacity>
      </Col>
    </Row>
  </Grid>
);

export default class CameraPage extends React.Component {
  constructor(props) {
    super(props);

    //this.camera = null;

    this.state = {
      captures: [],
      capturing: null,
      hasCameraPermission: null,
      cameraType: RNCamera.Constants.Type.back,
      flashMode: RNCamera.Constants.FlashMode.off,
      students: [],
      collegeCode: '',
      Token: null,
      item: this.props.item,
      images: [],
      currentIndex: 0,
      pressed: false,
    };
    this.overlayComp = null;
  }
  setFlashMode = (flashMode) => this.setState({flashMode});
  setCameraType = (cameraType) => this.setState({cameraType});

  uploadHandler = async () => {
    this.setState({loader: true});
    const token = await AsyncStorage.getItem('token');
    const collegeCode = this.state.collegeCode;
    let formData = new FormData();
    formData.append('images', JSON.stringify(this.state.images));
    formData.append('collegecode', collegeCode.toString());
    const configs = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        //   Authorization:
        //     'Bearer ' +
        //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg3Y2JlMy00M2FlLTQzODYtODcyYS1jZWFkMmJlYTM1YTIiLCJVc2VyTmFtZSI6IjExMjMiLCJEQiI6ImFUNXV4ZGd2empUQ1IwaWhrSkV6YVcrWCpOTVVBcERMNUVPa1lnZHA5d0NCUk1YOWc3am5iTkdOdVVieUlmd0FRbG1rVkx4c0xPKnVVRWpBaHhkN3V2YVljZVY5UWhiaEVUZVc5Kk1BTzJydjVDY3BWK3hxMEJ6RHpuOEt4M2lZb3AzKzFXSDl5MzhDKkVmZUxBRXQ0V3djSThnZ2hFaFFaRUZ2TjlZcG9VdkUxaXo3eHhMUXRVSllabUwqd3FRS0k0b0VqZWtkSUNPOCo1ckpMYVRCUFl6cTFrVDZzZlQqVFQwa2d4YjRqeEg2OEQwSmlLK1QrT2orYXhjdXdDTDNNQ24yWjkreGkyeXRLUnplUjZpOXJ2eTYyYW1HdWVKTjJteEpoRHpUcmhyOTlKNXM1aGUqTFlYbzY3MWtNeHdYMkRHME9IaTErUFFMMzNKRndPMXZ5UT09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6InJhbWFiYWRyYW4iLCJ1c2VyX2NvZGUiOiIzMDkiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiIiwibmJmIjoxNjE2MTc1NDI2LCJleHAiOjE2MTYxODI2MjYsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ZiE5-dLDr7L33o_M64K5b9GuafauszbmJmNXW4hbgmQ',
      },
      body: formData,
    };
    try {
      const response = await fetch(
        'http://103.87.172.204:5692/api/v1/student/validate/face',
        configs,
      );

      //console.log('esp', JSON.stringify(response, null, 4));
      const json = await response.json();

      let students = [];
      json.status.forEach((appNo) => {
        this.state.json.forEach((el, i) => {
          if (el.appNo === appNo) {
            students.push(el);
          }
        });
      });
      //console.log('STUDENTS ==>', students);
      this.setState({students}, async () => {
        //alert('Total Students Present - ' + students.length.toString())
        if (students.length > 0) {
          await this.submitHandler();
          this.setState({loader: false});
          return this.props.navigation.navigate('StaffSideAttendanceDetail', {
            item: this.state.item,
            hour: this.state.item.hour.toString(),
            title: this.state.item.subjectName,
          });
          // return this.props.navigation.navigate('StaffSideAttendanceDetail', {
          //   students,
          // });
        }
        alert('Students: ' + JSON.stringify(students));
      });

      ////console.log('JSON', json);
      this.setState({loader: false, data: json.status});
    } catch (e) {
      //console.log(e);
      this.setState({Show: false, loader: false});
      alert('No student present');
      return setTimeout(
        //() => this.props.navigation.navigate('FaceRegister'),
        () => this.props.navigation.goBack(),
        800,
      );
    }
  };

  handleShortCapture = async () => {
    const options = {base64: true, quality: 1};
    const photoData = await this.camera.takePictureAsync(options);
    this.setState({
      capturing: false,
      captures: [photoData, ...this.state.captures],
      images: [{image: photoData.base64}, ...this.state.images],
    });
  };

  submitHandler = async () => {
    this.setState({loader: true});
    let body = [];
    const token = await AsyncStorage.getItem('token');
    this.state.students.forEach((student) => {
      body.push({
        registratioNumber: student.registrationNo,
        hour: Number(this.state.item.hour),
        date: moment(this.state.item.date, 'MM/DD/YYYY h:mm:ss a').format(
          'YYYY-MM-DDTHH:mm:ss.SSS',
        ),
        attVal: '1',
      });
    });
    if (body.length > 0) {
      this.markAttendance(body, token).then((resp) => {
        // this.setState({loader: false});
        if (resp) {
          return alert(
            `Attendance marked successfully of ${body.length.toString()} student(s)`,
          );
        }
        this.setState({images: [], Show: false, students: [], loader: false});
        alert(
          'Unhandled exception occured while marking attendance. Please try again.',
        );
      });
    }
  };

  markAttendance = async (body, token) => {
    try {
      const configs = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
          // Authorization:
          //   'Bearer ' +
          //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg3Y2JlMy00M2FlLTQzODYtODcyYS1jZWFkMmJlYTM1YTIiLCJVc2VyTmFtZSI6IjExMjMiLCJEQiI6ImFUNXV4ZGd2empUQ1IwaWhrSkV6YVcrWCpOTVVBcERMNUVPa1lnZHA5d0NCUk1YOWc3am5iTkdOdVVieUlmd0FRbG1rVkx4c0xPKnVVRWpBaHhkN3V2YVljZVY5UWhiaEVUZVc5Kk1BTzJydjVDY3BWK3hxMEJ6RHpuOEt4M2lZb3AzKzFXSDl5MzhDKkVmZUxBRXQ0V3djSThnZ2hFaFFaRUZ2TjlZcG9VdkUxaXo3eHhMUXRVSllabUwqd3FRS0k0b0VqZWtkSUNPOCo1ckpMYVRCUFl6cTFrVDZzZlQqVFQwa2d4YjRqeEg2OEQwSmlLK1QrT2orYXhjdXdDTDNNQ24yWjkreGkyeXRLUnplUjZpOXJ2eTYyYW1HdWVKTjJteEpoRHpUcmhyOTlKNXM1aGUqTFlYbzY3MWtNeHdYMkRHME9IaTErUFFMMzNKRndPMXZ5UT09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6InJhbWFiYWRyYW4iLCJ1c2VyX2NvZGUiOiIzMDkiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiIiwibmJmIjoxNjE2MTc1NDI2LCJleHAiOjE2MTYxODI2MjYsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ZiE5-dLDr7L33o_M64K5b9GuafauszbmJmNXW4hbgmQ',
        },
        body: JSON.stringify(body),
      };
      const response = await fetch(
        config.baseUrl2 + 'staff/MarkAttendanceOfStudentOfParticularClass',
        configs,
      );
      const json = await response.json();

      if (json.status) {
        return true;
      } else {
        return false;
      }

      ////console.log('JSON', json);
    } catch (e) {
      return false;
    }
  };

  studentDetails = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      const configs = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + value,
          // Authorization:
          //   'Bearer ' +
          //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI0Mjg3Y2JlMy00M2FlLTQzODYtODcyYS1jZWFkMmJlYTM1YTIiLCJVc2VyTmFtZSI6IjExMjMiLCJEQiI6ImFUNXV4ZGd2empUQ1IwaWhrSkV6YVcrWCpOTVVBcERMNUVPa1lnZHA5d0NCUk1YOWc3am5iTkdOdVVieUlmd0FRbG1rVkx4c0xPKnVVRWpBaHhkN3V2YVljZVY5UWhiaEVUZVc5Kk1BTzJydjVDY3BWK3hxMEJ6RHpuOEt4M2lZb3AzKzFXSDl5MzhDKkVmZUxBRXQ0V3djSThnZ2hFaFFaRUZ2TjlZcG9VdkUxaXo3eHhMUXRVSllabUwqd3FRS0k0b0VqZWtkSUNPOCo1ckpMYVRCUFl6cTFrVDZzZlQqVFQwa2d4YjRqeEg2OEQwSmlLK1QrT2orYXhjdXdDTDNNQ24yWjkreGkyeXRLUnplUjZpOXJ2eTYyYW1HdWVKTjJteEpoRHpUcmhyOTlKNXM1aGUqTFlYbzY3MWtNeHdYMkRHME9IaTErUFFMMzNKRndPMXZ5UT09IiwiSXNTY2hvb2wiOiJUcnVlIiwidXNlcl9pZCI6InJhbWFiYWRyYW4iLCJ1c2VyX2NvZGUiOiIzMDkiLCJjb2xsZWdlX2NvZGUiOiIxMyIsImNvbGxlZ2VOYW1lIjoiIiwibmJmIjoxNjE2MTc1NDI2LCJleHAiOjE2MTYxODI2MjYsImlzcyI6InBhbHBhcC1wcm9kLWVudmlyb25tZW50IiwiYXVkIjoicGFscGFwcHJvZHVzZXJzIn0.ZiE5-dLDr7L33o_M64K5b9GuafauszbmJmNXW4hbgmQ',
        },
        body: JSON.stringify({
          batchYear: this.state.item.batchYear,
          degreeCode: this.state.item.degCode,
          semester: this.state.item.sem.toString(),
          section: this.state.item.sections,
          subjectNo: this.state.item.subno.toString(),
          attDate: moment(this.state.item.date, 'MM/DD/YYYY h:mm:ss a').format(
            'YYYY-MM-DD',
          ),
          //attDate: new Date().toISOString(),
          hour: this.state.item.hour.toString(),
        }),
      };
      // //console.log('body ==>',configs.body);
      const response = await fetch(
        config.baseUrl2 + 'staff/GetStudentDetails',
        configs,
      );
      const json = await response.json();
      //console.log('JSON ==>', json);
      this.setState({json});
    } catch (e) {
      //console.log(e);
    }
  };

  async componentDidMount() {
    await this.studentDetails();
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({Token: value}, function () {});
      }
    } catch (error) {
      this.setState({Loader: false});
      alert('Error retrieving data');
    }
    try {
      const collegeCode = await AsyncStorage.getItem('collegeCode');
      //alert('collegeCode == ', collegeCode);
      if (collegeCode !== null) {
        this.setState({collegeCode: collegeCode}, function () {
          //console.log('college', collegeCode);
        });
      }
    } catch (error) {
      this.setState({Loader: false});
      alert('Error retrieving data');
    }
  }

  render() {
    const {
      flashMode,
      cameraType,
      capturing,
      captures,
      currentIndex,
      pressed,
    } = this.state;

    return (
      <React.Fragment>
        <Loader Loading={this.state.loader} />
        <View>
          <RNCamera
            type={cameraType}
            flashMode={flashMode}
            style={styles.preview}
            ref={(camera) => (this.camera = camera)}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
          />
        </View>

        {pressed && (
          <Overlay
            overlayStyle={{
              width: winWidth * 0.6,
              height: winHeight * 0.5,
              alignSelf: 'center',
              backgroundColor: 'transparent',
            }}
            isVisible={pressed}
            onBackdropPress={() => this.setState({pressed: false})}>
            <CustomFastImage
              resizeMode={'contain'}
              source={{uri: captures[currentIndex].uri}}
              style={{width: '100%', height: '80%', resizeMode: 'cover'}}
            />
            <CustomButton
              title={'Delete'}
              onPress={() => {
                const newImages = captures.filter(
                  (image, i) => i !== currentIndex,
                );
                this.setState({captures: newImages, pressed: false});
              }}
            />
          </Overlay>
        )}

        {/* {captures.length > 0 && <Gallery openImage = {(index) => this.openImage(index)} captures={captures} />} */}
        {captures.length > 0 && (
          <ScrollView
            horizontal={true}
            style={[styles.bottomToolbar, styles.galleryContainer]}>
            {captures.map(({uri}, index) => (
              <TouchableOpacity
                onPress={() =>
                  this.setState({currentIndex: index, pressed: true})
                }
                style={styles.galleryImageContainer}
                key={uri}>
                <CustomFastImage
                  resizeMode={'contain'}
                  source={{uri}}
                  style={styles.galleryImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        <Toolbar
          capturing={capturing}
          flashMode={flashMode}
          uploadHandler={this.uploadHandler}
          setFlashMode={this.setFlashMode}
          setCameraType={this.setCameraType}
          onShortCapture={this.handleShortCapture}
        />
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    height: winHeight,
    width: winWidth,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  bottomToolbar: {
    width: winWidth,
    position: 'absolute',
    height: 100,
    bottom: 0,
  },
  captureBtn: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 60,
    borderColor: '#FFFFFF',
  },
  captureBtnActive: {
    width: 80,
    height: 80,
  },
  captureBtnInternal: {
    width: 76,
    height: 76,
    borderWidth: 2,
    borderRadius: 76,
    backgroundColor: 'red',
    borderColor: 'transparent',
  },
  galleryContainer: {
    bottom: 100,
  },
  galleryImageContainer: {
    width: 75,
    height: 75,
    marginRight: 5,
  },
  galleryImage: {
    width: 75,
    height: 75,
  },
});
