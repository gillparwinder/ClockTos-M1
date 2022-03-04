import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import config from '../../config/config';
import ResponsiveSize from '../../config/ResponsiveSize';
import ProgressCircle from 'react-native-progress-circle';
import FastImage from 'react-native-fast-image';
import {heightPercentageToDP} from 'react-native-responsive-screen';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export class CustomImageSubjects extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {
      onPress,
      staffImage,
      staffName,
      mailId,
      number,
      type,
      subjectName,
      source,
      colorCode,
      colorCode2,
      percentage,
    } = this.props;
    return (
      <TouchableOpacity
        key={Math.random()}
        onPress={() => {
          onPress();
        }}
        style={{
          height: 150,
          width: '100%',
          //backgroundColor: 'red',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          //marginBottom: heightPercentageToDP(1),
          padding: heightPercentageToDP(0.3),
        }}>
        <FastImage
          style={{width: '100%', height: '100%', position: 'absolute'}}
          source={source}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View
          style={{
            width: '95%',
            alignSelf: 'center',
            //height: '100%',
            padding: heightPercentageToDP('1'),
          }}>
          <View
            style={{
              width: '100%',
              //height: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              //  paddingHorizontal: 20,
              //paddingVertical: 10,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: staffImage
                  ? '60%'
                  : percentage != null || percentage != undefined
                  ? '80%'
                  : '100%',
                //width: '60%',
                //height: '100%',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  width: '100%',
                  //height: '100%',
                  justifyContent: 'space-evenly',
                  paddingRight: 10,
                }}>
                {staffName ? (
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <FastImage
                      style={{
                        width: 15,
                        height: 15,
                        marginRight: 10,
                      }}
                      source={require('../../assets/user2.png')}
                      resizeMode={FastImage.resizeMode.contain}
                    />

                    {staffName ? (
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.StaffDetailTextStyle,
                          {color: colorCode2, fontWeight: 'bold'},
                        ]}>
                        {staffName}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
                {mailId ? (
                  <View
                    style={{
                      width: '90%',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <FastImage
                      style={{
                        width: 15,
                        height: 15,
                        marginRight: 10,
                      }}
                      source={require('../../assets/mail.png')}
                      resizeMode={FastImage.resizeMode.contain}
                    />

                    {mailId ? (
                      <Text
                        numberOfLines={2}
                        style={styles.StaffDetailTextStyle}>
                        {mailId}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
                {number ? (
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <FastImage
                      style={{
                        width: 15,
                        height: 15,
                        marginRight: 10,
                      }}
                      source={require('../../assets/call.png')}
                      resizeMode={FastImage.resizeMode.contain}
                    />

                    <Text numberOfLines={1} style={styles.StaffDetailTextStyle}>
                      {number}
                    </Text>
                  </View>
                ) : null}

                {type ? (
                  <Text
                    numberOfLines={1}
                    style={[styles.StaffDetailTextStyle, {color: 'gray'}]}>
                    {type}
                  </Text>
                ) : null}
              </View>
            </View>
            {percentage != null || percentage != undefined ? (
              <View
                style={{
                  width: '15%',
                  //height: '100%',
                  justifyContent: 'center',
                  //alignItems: 'center',
                }}>
                <ProgressCircle
                  percent={percentage}
                  //  percent={35}
                  radius={25}
                  borderWidth={4}
                  color="white"
                  shadowColor="gray"
                  bgColor={colorCode}>
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 45,
                      backgroundColor: 'white',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: ResponsiveSize(config.AppAllTextSize),
                        color: 'green',
                        fontWeight: 'bold',
                      }}>
                      {percentage}%
                    </Text>
                  </View>
                </ProgressCircle>
              </View>
            ) : null}
            {staffImage ? (
              <View
                style={{
                  width: '25%',
                  //height: '100%',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  marginBottom: 5,
                  //marginLeft: 5,
                }}>
                <View
                  style={{
                    width: 85,
                    height: 85,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 100,
                    borderWidth: 6,
                    borderColor: colorCode,
                    padding: 3,
                  }}>
                  <FastImage
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 80,
                    }}
                    source={{
                      uri: `data:image/jpeg;base64,${staffImage}`,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                </View>
              </View>
            ) : null}
          </View>
          {subjectName ? (
            <Text
              numberOfLines={3}
              style={[
                styles.StaffDetailTextStyle,
                {
                  color: 'white',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: ResponsiveSize(13),
                },
              ]}>
              {subjectName}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  SubjectMainContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  SubjectNameImageView: {
    width: '95%',
    alignSelf: 'center',
    //height: 60,
    resizeMode: 'stretch',
    position: 'absolute',
    borderRadius: 15,
    marginVertical: 10,
  },
  SubjectNameTextView: {
    //height: 60,
    width: '90%',
    justifyContent: 'center',
    position: 'absolute',
    marginVertical: 10,
    alignItems: 'center',
  },
  StaffDetailTextStyle: {
    fontFamily: 'Poppins-Regular',
  },
});
