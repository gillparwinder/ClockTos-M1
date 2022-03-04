import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';

import {CustomHeader} from '../components/CustomHeader';
import {Loader} from '../components/Loader';
import config from '../config/config';
import {RNCamera} from 'react-native-camera';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Overlay} from 'react-native-elements';
import {CustomButton} from '../components/common/Button';
import RNFetchBlob from 'rn-fetch-blob';
import CustomFastImage from '../components/common/CustomFastImage';

const CapturePhotos = (props) => {
  const [state, setState] = useState({
    loader: false,
    camera: null,
    values: (props.route.params && props.route.params.values) || {},
  });
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
  const [photos, setPhotos] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoType, setPhotoType] = useState('Front');
  const [front, setFront] = useState(true);
  const [back, setBack] = useState(true);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [overLay, setOverLay] = useState(false);

  const RenderButton = ({
    bgColor,
    minWidth,
    buttonText,
    icon,
    onPress,
    disabled,
  }) => {
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        style={{
          backgroundColor: bgColor,
          minWidth: minWidth || null,
          alignSelf: 'center',
          alignItems: 'center',
          paddingVertical: 10,
          paddingHorizontal: 10,
          borderRadius: 10,
          marginVertical: 20,
          justifyContent: 'space-evenly',
          flexDirection: icon ? 'row' : 'column',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: config.textSize,
            fontFamily: config.fontFamily.regular,
            marginRight: 2,
            textAlign: 'center',
          }}>
          {buttonText}
        </Text>
        {icon && <Icon name={icon} size={20} color="#ffffff" />}
      </TouchableOpacity>
    );
  };
  const takePicture = async (camera) => {
    const options = {quality: 1, base64: true};
    const item = props.route.params?.item || {};
    const isStudent = props.route.params?.isStudent || false;
    ////console.log('CAMERA', camera);
    if (camera) {
      setState({...state, loader: true});
      try {
        const image = await camera.takePictureAsync(options);
        if (image.uri) {
          //console.log(
          //  ' app_No: Number(item.appNo)',
          //  isStudent ? Number(item.appNo) : item.appNo,
          //);
          //console.log('  Number(item.appNo)', Number(item.appNo));
          setPhoto(image.uri);
          //console.log(
          //  JSON.stringify({
          //    photo: image.base64,
          //    photoType,
          //    photoURL: '',
          //    id: 'string',
          //    app_No: isStudent ? Number(item.appNo) : item.appNo,
          //    regNo: item.regNo,
          //  }),
          //);
          setPhotos([
            ...photos,
            {
              photo: image.base64,
              photoType,
              photoURL: '',
              id: 'string',
              app_No: isStudent ? Number(item.appNo) : parseInt(item.appNo),
              regNo: item.regNo,
            },
          ]);

          // if (photoType === 'Front') {
          //   setFront(false);
          //   setLeft(true);
          //   setPhotoType('Left');
          //   setRight(false);
          // }
          // if (photoType === 'Left') {
          //   setFront(false);
          //   setLeft(false);
          //   setRight(true);
          //   setPhotoType('Right');
          // }
          // if (photoType === 'Right') {
          //   setFront(false);
          //   setLeft(false);
          //   setRight(false);
          // }
          setState({...state, loader: false});
          ////console.log('photos ==>', photos);
        }
      } catch (e) {
        //console.log(e);
        setState({...state, loader: false});
      }
    }
  };

  const takeVideo = async (camera) => {
    const options = {maxDuration: 5, maxFileSize: 4 * 1024 * 1024};
    try {
      const video = await camera.recordAsync(options);
      if (video.uri) {
        setState({...state, loader: true});
        let dataa = '';
        RNFetchBlob.fs
          .readStream(
            // file path
            video.uri,
            // encoding, should be one of `base64`, `utf8`, `ascii`
            'base64',
            // (optional) buffer size, default to 4096 (4095 for BASE64 encoded data)
            // when reading file in BASE64 encoding, buffer size must be multiples of 3.
            4095,
          )
          .then((ifstream) => {
            ifstream.open();
            ifstream.onData((chunk) => {
              dataa += chunk;
            });
            ifstream.onError((err) => {
              //console.log('oops', err);
            });
            ifstream.onEnd(async () => {
              const token = await AsyncStorage.getItem('token');
              const name =
                (props.route.params && props.route.params.item.studentName) ||
                '';
              const isStudent =
                (props.route.params && props.route.params.item.isStudent) ||
                false;
              const staffCode =
                (props.route.params && props.route.params.item.staffCode) ||
                'string';
              const regNo =
                (props.route.params && props.route.params.item.regNo) || '';
              const app_No =
                (props.route.params && props.route.params.item.appNo) || '';
              const rollNo =
                (props.route.params && props.route.params.item.rollNo) || '';
              const department =
                (props.route.params && props.route.params.department) || '';
              //const values = (props.route.params && props.route.params.values) || '';

              //console.log('regNo===?', regNo);
              //console.log(
              //  JSON.stringify({
              //    id: 'string',
              //    name,
              //    regNo,
              //    rollNo,
              //    isStudent,
              //    collegeCode: state.values.collegeCode,
              //    batchYear: state.values.batchYear
              //      ? Number(state.values.batchYear)
              //      : 0,
              //    educationLevel: state.values.educationLevel,
              //    degreeCode: state.values.degreeCode,
              //    department,
              //    semester: state.values.semester,
              //    section: state.values.section,
              //    staffCode,
              //    userCode: 'string',
              //    app_No: isStudent ? Number(app_No) : parseInt(app_No),
              //    base64StringFile: dataa,
              //  }),
              //);
              const configs = {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + token,
                },
                body: JSON.stringify({
                  id: 'string',
                  name,
                  regNo,
                  rollNo,
                  isStudent,
                  collegeCode: state.values.collegeCode,
                  batchYear: state.values.batchYear
                    ? Number(state.values.batchYear)
                    : 0,
                  educationLevel: state.values.educationLevel,
                  degreeCode: state.values.degreeCode,
                  department,
                  semester: state.values.semester,
                  section: state.values.section,
                  staffCode,
                  userCode: 'string',
                  app_No: isStudent ? Number(app_No) : parseInt(app_No),
                  base64StringFile: dataa,
                }),
              };

              const response = await fetch(
                isStudent
                  ? 'https://insproplus.com/erpv2api/api/staff/' +
                      'RegisterStudentWithVideo'
                  : 'https://insproplus.com/erpv2api/api/staff/RegisterWithVideo',
                configs,
              );
              const json = await response.json();

              if (json === 'SUCCESS') {
                setState({...state, loader: false});
                setLeft(false);
                alert('Face registration completed!');
                return props.navigation.goBack();
              }
              //console.log(json);
              setState({...state, loader: false});
              return alert('Error registering video. Please try again');
              //setLeft(false);
            });
          });
      }
    } catch (err) {
      //console.log('error', err);
      setState({...state, loader: false});
      return alert('Error capturing video. Please try again');
    }
  };

  const registerFace = async (data) => {
    const token = await AsyncStorage.getItem('token');
    const name =
      (props.route.params && props.route.params.item.studentName) || '';
    const regNo = (props.route.params && props.route.params.item.regNo) || '';
    const department =
      (props.route.params && props.route.params.department) || '';
    const rollNo = (props.route.params && props.route.params.item.rollNo) || '';
    const values = (props.route.params && props.route.params.values) || '';
    const isStudent =
      (props.route.params && props.route.params.item.isStudent) || false;
    const app_No = (props.route.params && props.route.params.item.appNo) || '';
    const staffCode =
      (props.route.params && props.route.params.item.staffCode) || 'string';
    setState({...state, loader: true});
    //console.log('regNo===?', isStudent ? regNo : app_No);
    //console.log(
    //  JSON.stringify({
    //    id: 'string',
    //    name,
    //    regNo,
    //    isStudent,
    //    rollNo,
    //    collegeCode: state.values.collegeCode,
    //    batchYear: state.values.batchYear ? Number(state.values.batchYear) : 0,
    //    educationLevel: state.values.educationLevel,
    //    degreeCode: state.values.degreeCode,
    //    department,
    //    semester: state.values.semester,
    //    section: state.values.section,
    //    staffCode,
    //    userCode: 'string',
    //    app_No: isStudent ? Number(data[0].app_No) : parseInt(app_No),
    //    photos: [...data],
    //  }),
    //);
    try {
      const configs = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          id: 'string',
          name,
          regNo,
          isStudent,
          rollNo,
          collegeCode: state.values.collegeCode,
          batchYear: state.values.batchYear
            ? Number(state.values.batchYear)
            : 0,
          educationLevel: state.values.educationLevel,
          degreeCode: state.values.degreeCode,
          department,
          semester: state.values.semester,
          section: state.values.section,
          staffCode,
          userCode: 'string',
          app_No: isStudent ? Number(data[0].app_No) : parseInt(app_No),
          photos: [...data],
        }),
      };
      //console.log(
      //  JSON.stringify({
      //    id: 'string',
      //    name,
      //    regNo,
      //    isStudent,
      //    rollNo,
      //    collegeCode: state.values.collegeCode,
      //    batchYear: state.values.batchYear
      //      ? Number(state.values.batchYear)
      //      : 0,
      //    educationLevel: state.values.educationLevel,
      //    degreeCode: state.values.degreeCode,
      //    department,
      //    semester: state.values.semester,
      //    section: state.values.section,
      //    staffCode,
      //    userCode: 'string',
      //    app_No: isStudent ? Number(data[0].app_No) : parseInt(app_No),
      //    photos: [...data],
      //  }),
      //);
      //console.log('body', {
      //  app_No: isStudent ? Number(data[0].app_No) : app_No,
      //});
      const response = await fetch(
        isStudent
          ? 'https://insproplus.com/erpv2api/api/staff/' + 'RegisterStudent'
          : 'https://insproplus.com/erpv2api/api/staff/RegisterUser',
        configs,
      );
      const json = await response.json();

      ////console.log('RESPNSE_', JSON.stringify(response, null, 4));
      //console.log('RESPNSE', json);
      if (json == 'SUCCESS') {
        setFront(false);
        setLeft(true);
        setPhotoType('Left');
        setRight(false);

        setState({...state, loader: false});
        return alert(
          'Viola! Photo is registered. Please do video registration to complete the face registration process',
        );
        // alert('Face is registered successfully!');
        // return props.navigation.goBack();
      }
      setState({...state, loader: false});
      alert('Face registration failed. Please try again.');
      setFront(true);
      setPhotos([]);
      setPhotoType('Front');
    } catch (e) {
      //console.log('error', e);
      setState({...state, loader: false});
      alert('Unhandled exception occurred. Please try again');
      return props.navigation.goBack();
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <Loader Loading={state.loader ? true : false} />

      <CustomHeader
        isHome={false}
        title={'Photo Attendance'}
        navigation={props.navigation}
        //notification
      />
      <View
        style={{
          flexDirection: 'row',
          width: '95%',
          alignItems: 'center',
          alignSelf: 'center',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}>
        <RenderButton
          disabled={!left}
          bgColor={!left ? '#C8C8C8' : '#24B1EE'}
          minWidth={'40%'}
          buttonText={'Video'}
          icon={left ? 'camera' : !left && !front ? 'check-circle' : 'smile'}
          // icon={
          //   photos.length === 1
          //     ? 'camera'
          //     : (!left && photos.length === 2) || photos.length === 3
          //     ? 'check-circle'
          //     : 'smile'
          // }
          onPress={() => {
            setFront(false);
            setLeft(true);
          }}
        />
        <RenderButton
          disabled={!front}
          bgColor={!front ? '#C8C8C8' : '#6397F2'}
          minWidth={'40%'}
          buttonText={'Photo'}
          icon={front ? 'camera' : 'check-circle'}
          onPress={() => {
            setLeft(false);
            setFront(true);
          }}
        />
        {/* <RenderButton
          disabled={!right}
          bgColor={!right ? '#C8C8C8' : '#6397F2'}
          minWidth={'20%'}
          buttonText={'Right'}
          icon={
            photos.length === 2
              ? 'camera'
              : photos.length === 3
              ? 'check-circle'
              : 'smile'
          }
          onPress={() => setPhotoType('Right')}
        /> */}
      </View>
      {front && (
        <RNCamera
          style={styles.preview}
          type={
            back ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front
          }
          flashMode={flashMode}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({camera, status, recordAudioPermissionStatus}) => {
            // if (status === 'READY') {
            //   setState({...state, camera});
            // }
            //console.log('Status', status);
            if (status !== 'READY') return <View />;
            return (
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <View style={{position: 'absolute', bottom: 0, left: -30}}>
                  <Icon1
                    name={'camera-reverse'}
                    color={'#6397F2'}
                    size={30}
                    onPress={() => setBack(!back)}
                  />
                </View>
                <View style={{position: 'absolute', bottom: 0, right: -40}}>
                  <Icon1
                    name={
                      flashMode === RNCamera.Constants.FlashMode.on
                        ? 'md-flash'
                        : 'md-flash-off'
                    }
                    color={'#6397F2'}
                    size={30}
                    onPress={() =>
                      setFlashMode(
                        flashMode === RNCamera.Constants.FlashMode.on
                          ? RNCamera.Constants.FlashMode.off
                          : RNCamera.Constants.FlashMode.on,
                      )
                    }
                  />
                </View>
                <View>
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={{
                      width: 200,
                      height: 200,
                      marginBottom: 30,
                    }}
                    ////source={require('../assets/photo.png')}
                  />
                  <TouchableOpacity
                    onPress={() => takePicture(camera)}
                    style={styles.capture}>
                    {/* <Text style={{fontSize: 14}}> SNAP </Text> */}
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderWidth: 2,
                        borderRadius: 60,
                        borderColor: '#FFFFFF',
                      }}></View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        </RNCamera>
      )}
      {left && (
        <RNCamera
          style={styles.preview}
          type={
            back ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front
          }
          flashMode={flashMode}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}>
          {({camera, status, recordAudioPermissionStatus}) => {
            // if (status === 'READY') {
            //   setState({...state, camera});
            // }
            //console.log('Status', status);
            if (status !== 'READY') return <View />;
            return (
              <View
                style={{
                  flex: 0,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <View style={{position: 'absolute', bottom: 0, left: -30}}>
                  <Icon1
                    name={'camera-reverse'}
                    color={'#6397F2'}
                    size={30}
                    onPress={() => setBack(!back)}
                  />
                </View>
                <View style={{position: 'absolute', bottom: 0, right: -40}}>
                  <Icon1
                    name={
                      flashMode === RNCamera.Constants.FlashMode.on
                        ? 'md-flash'
                        : 'md-flash-off'
                    }
                    color={'#6397F2'}
                    size={30}
                    onPress={() =>
                      setFlashMode(
                        flashMode === RNCamera.Constants.FlashMode.on
                          ? RNCamera.Constants.FlashMode.off
                          : RNCamera.Constants.FlashMode.on,
                      )
                    }
                  />
                </View>
                <View>
                  <CustomFastImage
                    resizeMode={'contain'}
                    style={{
                      width: 200,
                      height: 200,
                      marginBottom: 30,
                    }}
                    //source={require('../assets/photo.png')}
                  />
                  <TouchableOpacity
                    onPress={() => takeVideo(camera)}
                    style={styles.capture}>
                    {/* <Text style={{fontSize: 14}}> SNAP </Text> */}
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderWidth: 2,
                        borderRadius: 60,
                        borderColor: '#FFFFFF',
                      }}></View>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        </RNCamera>
      )}
      {photo && (
        <TouchableOpacity
          style={{width: 80, height: 80}}
          onPress={() => {
            setOverLay(true);
            //console.log('photo', photo);
          }}>
          <CustomFastImage
            source={{uri: photo}}
            style={{width: '100%', height: '100%'}}
            resizeMode={'contain'}
          />
        </TouchableOpacity>
      )}
      {overLay && (
        <Overlay
          overlayStyle={{width: '80%', height: '80%'}}
          isVisible={overLay}
          onBackdropPress={() => setOverLay(false)}>
          <Loader Loading={state.loader} />

          <CustomFastImage
            source={{uri: photo}}
            style={{width: '100%', height: '100%'}}
            resizeMode={'contain'}
          />
          <View
            style={{
              width: '100%',
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginTop: 20,
            }}>
            <CustomButton
              width={'40%'}
              title={'Delete'}
              onPress={() => {
                setPhoto(null);
                setPhotos([]);
                setOverLay(false);
              }}
            />
            <CustomButton
              width={'40%'}
              title={'Upload'}
              onPress={async () => {
                await registerFace(photos);
                setPhotos([]);
                setOverLay(false);
                setPhoto(null);
              }}
            />
          </View>
        </Overlay>
      )}

      {/* <RenderButton
        disabled={photos.length < 3}
        bgColor={photos.length < 3 ? '#C8C8C8' : '#6397F2'}
        minWidth={'80%'}
        buttonText={'Face Registration'}
        onPress={() => registerFace()}
      /> */}
    </SafeAreaView>
  );
};

export default CapturePhotos;

const styles = StyleSheet.create({
  preview: {
    //width: widthPercentageToDP('10'),
    //height: 250,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    //alignSelf: 'center',
    borderWidth: 20,
    borderColor: 'transparent',
    marginVertical: 10,
  },
  capture: {
    flex: 0,

    // backgroundColor: '#fff',
    // borderRadius: 5,
    // padding: 15,
    //paddingHorizontal: 20,
    alignSelf: 'center',
    //margin: 20,
  },
});

// {right && (
//         <RNCamera
//           style={styles.preview}
//           type={
//             back ? RNCamera.Constants.Type.back : RNCamera.Constants.Type.front
//           }
//           flashMode={flashMode}
//           androidCameraPermissionOptions={{
//             title: 'Permission to use camera',
//             message: 'We need your permission to use your camera',
//             buttonPositive: 'Ok',
//             buttonNegative: 'Cancel',
//           }}>
//           {({camera, status, recordAudioPermissionStatus}) => {
//             // if (status === 'READY') {
//             //   setState({...state, camera});
//             // }
//             //console.log('Status', status);
//             if (status !== 'READY') return <View />;
//             return (
//               <View
//                 style={{
//                   flex: 0,
//                   flexDirection: 'row',
//                   justifyContent: 'center',
//                 }}>
//                 <View style={{position: 'absolute', bottom: 0, left: -30}}>
//                   <Icon1
//                     name={'camera-reverse'}
//                     color={'#6397F2'}
//                     size={30}
//                     onPress={() => setBack(!back)}
//                   />
//                 </View>
//                 <View style={{position: 'absolute', bottom: 0, right: -40}}>
//                   <Icon1
//                     name={
//                       flashMode === RNCamera.Constants.FlashMode.on
//                         ? 'md-flash'
//                         : 'md-flash-off'
//                     }
//                     color={'#6397F2'}
//                     size={30}
//                     onPress={() =>
//                       setFlashMode(
//                         flashMode === RNCamera.Constants.FlashMode.on
//                           ? RNCamera.Constants.FlashMode.off
//                           : RNCamera.Constants.FlashMode.on,
//                       )
//                     }
//                   />
//                 </View>
//                 <View>
//                   <CustomFastImage
//resizeMode={'contain'}
//                     style={{
//                       width: 200,
//                       height: 200,
//                       marginBottom: 30,
//                     }}
//                     //source={require('../assets/photo.png')}
//                   />
//                   <TouchableOpacity
//                     onPress={() => takePicture(camera)}
//                     style={styles.capture}>
//                     {/* <Text style={{fontSize: 14}}> SNAP </Text> */}
//                     <View
//                       style={{
//                         width: 60,
//                         height: 60,
//                         borderWidth: 2,
//                         borderRadius: 60,
//                         borderColor: '#FFFFFF',
//                       }}></View>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             );
//           }}
//         </RNCamera>
//       )}
