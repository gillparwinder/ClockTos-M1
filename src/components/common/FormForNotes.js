import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Input, NativeBaseProvider, HStack} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-tiny-toast';
import {SafeAreaView} from 'react-native';
import {Checkbox, RadioButton} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Dimensions} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {TouchableOpacity} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import {CustomButton} from './Button';
import CustomFastImage from './CustomFastImage';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const Color1 = '#23C4D7';
const Color2 = '#6397F2';
export default class FormForNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Description: '',
      subject: '',
      NotesAttachment: {},
      HomeworkAttachment: {},
    };
  }
  send = () => {
    //console.log('hit outside');
    this.props.Notes
      ? this.props.send({
          NotesAttachment: this.state.NotesAttachment,
        })
      : //console.log('hit notes')
        this.props.send({
          HomeworkAttachment: this.state.HomeworkAttachment,
          subject: this.state.subject,
          Description: this.state.Description,
        });
    //console.log('hit homework');
  };

  SelectHomeworkFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        includeBase64: true,

        type: [DocumentPicker.types.allFiles],
        //There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      //Printing the log realted to the file
      //console.log('res : ' + JSON.stringify(res));
      //  console.log('URI : ' + res.uri);
      this.setState({TempImg: res.uri});
      //console.log('Type : ' + res.type);
      //console.log('File Name : ' + res.name);
      //console.log('File Size : ' + res.size);
      //Setting the state to show single file attributes
      let typeIdentifier = res.type.split('/');
      //console.log(typeIdentifier[1]);
      //alert(typeIdentifier[1]);
      RNFetchBlob.fs
        .readFile(res.uri, 'base64')
        .then((data) => {
          var HomeworkAttachment = {
            fileName:
              'HomeworkAttachment_' +
              new Date().getTime() +
              '.' +
              typeIdentifier[1],
            fileType: res.type,
            attachment: data,
          };

          this.setState({HomeworkAttachment}, function () {});
        })
        .catch((err) => {});
    } catch (err) {
      console.log('Unknown Error: ' + JSON.stringify(err));
    }
  };

  SelectNotesFile = async () => {
    //Opening Document Picker for selection of one file
    try {
      //const results = await DocumentPicker.pickMultiple({
      //    type: [DocumentPicker.types.images],
      //  });
      //  for (const res of results) {
      //    console.log(
      //      res.uri,
      //      res.type, // mime type
      //      res.name,
      //      res.size
      //    );
      //  }
      const res = await DocumentPicker.pick({
        includeBase64: true,
        allowMultiSelection: true,
        type: [DocumentPicker.types.allFiles],
      });
      let typeIdentifier = res.type.split('/');
      RNFetchBlob.fs
        .readFile(res.uri, 'base64')
        .then((data) => {
          var NotesAttachment = {
            fileName:
              'Attachment_' + new Date().getTime() + '.' + typeIdentifier[1],
            fileType: res.type,
            attachment: data,
          };

          this.setState({NotesAttachment}, function () {
            //console.log(this.state.NotesAttachment);
          });
        })
        .catch((err) => {});
    } catch (err) {
      console.log('Unknown Error: ' + JSON.stringify(err));
    }
  };
  dismiss = () => {
    this.props.dismiss();
  };
  //"FileType": "application/pdf"
  render() {
    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.container}>
          <View style={{width: '100%', flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                //  height: 45,
                marginBottom: 5,
                borderBottomWidth: 0.5,
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                disabled
                style={{
                  width: 30,
                  height: 30,
                }}></TouchableOpacity>
              <View
                disabled
                style={{
                  flex: 1,
                  height: 40,
                  alignItems: 'center',
                }}>
                <Text style={styles.label}>{this.props.heading}</Text>
              </View>
              <TouchableOpacity
                onPress={this.dismiss}
                style={{
                  width: 30,
                  height: 35,
                }}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={require('../../assets/cross.png')}
                />
              </TouchableOpacity>
            </View>
            <KeyboardAwareScrollView
              resetScrollToCoords={{x: 0, y: 0}}
              contentContainerStyle={{height: ScreenHeight, display: 'flex'}}
              scrollEnabled={true}>
              <View style={styles.cardContainer}>
                {this.props.Homework && (
                  <View>
                    <View style={styles.labelContainer}>
                      <Text style={[styles.label, {color: Color2}]}>
                        Heading
                      </Text>
                    </View>
                    <View>
                      <View style={[styles.item, {borderColor: 'transparent'}]}>
                        <Input
                          placeholder=""
                          style={styles.input}
                          value={this.state.subject}
                          onChangeText={(subject) => {
                            this.setState({subject});
                          }}
                        />
                      </View>
                    </View>
                  </View>
                )}
                {this.props.Homework && (
                  <View>
                    <View style={styles.labelContainer}>
                      <View style={styles.row}>
                        <Text style={[styles.label, {color: Color2}]}>
                          {'Description'}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.item1,
                        {borderWidth: 1, borderColor: Color2},
                      ]}>
                      <Input
                        multiline
                        blurOnSubmit={true}
                        bordered
                        style={styles.textarea}
                        value={this.state.Description}
                        onChangeText={(Description) => {
                          this.setState({Description});
                        }}
                      />
                    </View>
                  </View>
                )}
                {this.props.Notes && (
                  <View style={{marginTop: 20}}>
                    <TouchableWithoutFeedback
                      onPress={() => {
                        this.SelectNotesFile();
                      }}>
                      <View>
                        <HStack
                          style={[
                            styles.item,
                            {borderColor: Color1, color: Color1},
                          ]}>
                          <View
                            style={{
                              width: 50,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#F6F6F8',
                              height: '80%',
                              borderRadius: 5,
                              margin: 5,
                            }}>
                            <CustomFastImage
                              resizeMode={'contain'}
                              style={{
                                width: 20,
                                height: 20,
                              }}
                              source={require('../../assets/fileGreen.png')}
                            />
                          </View>
                          <Input
                            isDisabled
                            placeholder="Upload Notes File"
                            placeholderTextColor={Color1}
                            style={[styles.input, {borderWidth: 0}]}
                            value={
                              this.state.NotesAttachment
                                ? this.state.NotesAttachment.fileName
                                : ''
                            }
                            disabled
                          />
                          {Object.keys(this.state.NotesAttachment).length ? (
                            <TouchableOpacity
                              style={{
                                width: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#FFF5F5',
                                height: '80%',
                                borderRadius: 5,
                                margin: 5,
                              }}
                              onPress={() => {
                                Alert.alert(
                                  'Confirmation',
                                  'Are you sure to delete this file?',
                                  [
                                    {
                                      text: 'Cancel',
                                      onPress: () =>
                                        console.log('Cancel Pressed'),
                                      style: 'No',
                                    },
                                    {
                                      text: 'Yes',
                                      onPress: () =>
                                        this.setState(
                                          {NotesAttachment: {}},
                                          function () {
                                            //console.log(
                                            //  this.state.NotesAttachment,
                                            //);
                                          },
                                        ),
                                    },
                                  ],
                                );
                              }}>
                              <CustomFastImage
                                resizeMode={'contain'}
                                style={{
                                  width: 20,
                                  height: 20,
                                  //marginHorizontal: 5,
                                }}
                                source={require('../../assets/delete.png')}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={{
                                width: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                                height: '80%',
                                borderRadius: 5,
                                margin: 5,
                              }}
                            />
                          )}
                        </HStack>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                )}

                {this.props.Homework && (
                  <View style={{marginTop: 20}}>
                    <TouchableWithoutFeedback onPress={this.SelectHomeworkFile}>
                      <View>
                        <HStack
                          style={[
                            styles.item,
                            {borderColor: Color1, color: Color1},
                          ]}>
                          <View
                            style={{
                              width: 50,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#F6F6F8',
                              height: '80%',
                              borderRadius: 5,
                              margin: 5,
                            }}>
                            <CustomFastImage
                              resizeMode={'contain'}
                              style={{
                                width: 20,
                                height: 20,
                              }}
                              source={require('../../assets/fileGreen.png')}
                            />
                          </View>
                          <Input
                            isDisabled
                            placeholder="Upload HomeWork File"
                            placeholderTextColor={Color1}
                            style={[styles.input, {borderWidth: 0}]}
                            value={
                              this.state.HomeworkAttachment
                                ? this.state.HomeworkAttachment.fileName
                                : ''
                            }
                            disabled
                          />
                          {Object.keys(this.state.HomeworkAttachment).length ? (
                            <TouchableOpacity
                              style={{
                                width: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#FFF5F5',
                                height: '80%',
                                borderRadius: 5,
                                margin: 5,
                              }}
                              onPress={() => {
                                Alert.alert(
                                  'Confirmation',
                                  'Are you sure to delete this file?',
                                  [
                                    {
                                      text: 'Cancel',
                                      onPress: () =>
                                        console.log('Cancel Pressed'),
                                      style: 'No',
                                    },
                                    {
                                      text: 'Yes',
                                      onPress: () =>
                                        this.setState(
                                          {HomeworkAttachment: {}},
                                          function () {
                                            //console.log(
                                            //  this.state
                                            //    .HomeworkAttachment,
                                            //);
                                          },
                                        ),
                                    },
                                  ],
                                );
                              }}>
                              <CustomFastImage
                                resizeMode={'contain'}
                                style={{
                                  width: 20,
                                  height: 20,
                                }}
                                source={require('../../assets/delete.png')}
                              />
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              style={{
                                width: 50,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'transparent',
                                height: '80%',
                                borderRadius: 5,
                                margin: 5,
                              }}
                            />
                          )}
                        </HStack>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                )}
              </View>
            </KeyboardAwareScrollView>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: hp('1'),
            }}>
            <CustomButton
              title="Submit"
              onPress={() => {
                if (
                  this.props.Notes &&
                  Object.keys(this.state.NotesAttachment).length
                ) {
                  this.send();
                } else if (
                  (this.props.Homework &&
                    Object.keys(this.state.HomeworkAttachment).length) ||
                  this.state.subject.length ||
                  this.state.Description.length
                ) {
                  this.send();
                }
              }}
            />
          </View>
        </SafeAreaView>
      </NativeBaseProvider>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#089bf9',
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: 17,
    color: '#ffffff',
  },
  cardContainer: {
    marginTop: '1%',
    marginLeft: '1%',
    marginRight: '1%',
    justifyContent: 'center',
    width: Dimensions.get('window').width - 50,
  },
  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#000000',
  },
  label1: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#c9c3c5',
    paddingLeft: wp('3'),
  },
  labelContainer: {
    marginTop: 10,
  },
  input: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: Color2,
    height: 50,
    borderWidth: 1,
  },
  //item: {
  //  borderRadius: 10,
  //  backgroundColor: '#ffffff',
  //  height: hp('7'),
  //  borderColor: '#f1f1f1',
  //  borderWidth: 1.5,
  //},
  item: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginTop: 10,
    height: 55,
    borderWidth: 1,
    width: '100%',
    justifyContent: 'space-between',
  },

  item1: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderColor: '#f1f1f1',
    borderWidth: 1.5,
    marginTop: 10,
  },
  textarea: {
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderRadius: 8,
    minHeight: 120,
  },
  footerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    color: '#ffffff',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#f05760',
    borderRadius: 20,
    width: wp('30'),
    paddingRight: wp('7'),
    marginTop: '4%',
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#ffffff',
  },
  btImage: {
    width: 30,
    height: 30,
    marginRight: 10,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
  optional: {
    fontFamily: 'Poppins-Regular',
    color: 'red',
    fontSize: 12,
    margin: 2,
  },
  CheckBoxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: 5,
    //elevation: 2,
    paddingRight: 10,
    paddingLeft: 5,
    height: 30,
    borderWidth: 1,
    backgroundColor: 'white',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
});
