import React from 'react';
import {Image} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import config from '../../config/config';
import Video from 'react-native-video';
import VideoPlayer from 'react-native-video-controls';
import ResponsiveSize from '../../config/ResponsiveSize';
import CustomFastImage from '../../components/common/CustomFastImage';

const DisplayCard = (props) => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
      alignSelf: 'center',
      alignItems: 'center',
      borderRadius: 8,
      height: 140,
    },
    leftView: {
      width: '60%',
      padding: 5,
    },
    nameText: {
      fontFamily: config.fontFamily.regular,
      fontSize: ResponsiveSize(17),
      lineHeight: 25.5,
      fontWeight: '400',
      color: '#4D76F7',
    },
    numberText: {
      fontFamily: config.fontFamily.regular,
      fontSize: ResponsiveSize(13),
      lineHeight: 19.5,
      fontWeight: '400',
    },
    rightView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraContainer: {
      width: 27,
      height: 27,
      borderRadius: 27 / 2,
      backgroundColor: '#3976E0',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 7,
    },
    photoContainer: {
      width: 51,
      height: 51,
      borderRadius: 50,
    },
  });
  return (
    <View style={styles.container}>
      <CustomFastImage
        resizeMode={'stretch'}
        source={require('../../assets/face_card.png')}
        style={{
          width: '105%',
          height: 140,
          position: 'absolute',
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          flex: 1,
          width: '90%',
          margin: 0,
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 8,
        }}>
        <View style={styles.leftView}>
          {props.showName && (
            <Text numberOfLines={1} style={styles.nameText}>
              {props.index}. {props.name}{' '}
            </Text>
          )}
          {props.showStaff && (
            <Text numberOfLines={1} style={styles.numberText}>
              Staff. Code : {props.staffCode}
            </Text>
          )}
          {props.showAppNo && (
            <Text numberOfLines={1} style={styles.numberText}>
              App. No : {props.appNo}
            </Text>
          )}
          {props.showReg && (
            <Text numberOfLines={1} style={styles.numberText}>
              Reg. No : {props.number}
            </Text>
          )}

          {props.showRoll && (
            <Text numberOfLines={1} style={styles.numberText}>
              Roll No : {props.rollNumber}
            </Text>
          )}
        </View>
        <View style={styles.rightView}>
          <TouchableOpacity onPress={props.onPress}>
            <CustomFastImage
              resizeMode={'cover'}
              source={require('../../assets/camera.png')}
              style={{
                width: 27,
                height: 27,
                marginRight: 7,
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: 'rgba(57,118,224, 0.2)',
            }}>
            {/*{props.videoURL ? (
              <TouchableOpacity
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: 'rgba(57,118,224, 0.2)',
                }}
                onPress={() => {
                  props.navigation.navigate('Youtube', {url: props.videoURL});
                }}>
                <VideoPlayer
                  source={{uri: props.videoURL}}
                  //source={{uri: 'https://vjs.zencdn.net/v/oceans.mp4'}}
                  navigator={props.navigation}
                />
              </TouchableOpacity>
            ) : (*/}
            <CustomFastImage
              resizeMode={'cover'}
              source={{
                uri: props.imageURL,
              }}
              style={{
                width: 74,
                height: 74,
                //borderWidth: 10,
                borderRadius: 37,
              }}
            />
            {/*)}*/}
          </View>
        </View>
      </View>
    </View>
  );
};

export default DisplayCard;
