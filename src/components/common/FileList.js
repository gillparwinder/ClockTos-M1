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
import CommonFlatlist from './CommonFlatList';
import {Loader} from '../Loader';
const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;
const ToastData = {
  position: Toast.position.TOP,
  imgSource: require('../../assets/alert.png'),
  imgStyle: {width: 40, height: 40},
};
const Color1 = '#23C4D7';
const Color2 = '#6397F2';
export default class FileList extends Component {
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
    alert('hit');
  };

  dismiss = () => {
    this.props.dismiss();
  };
  renderItem = ({item, index}) => {
    return item.filePath ? (
      <View style={styles.cardContainer}>
        <TouchableWithoutFeedback onPress={this.SelectHomeworkFile}>
          <View>
            <HStack style={[styles.item, {borderColor: Color1, color: Color1}]}>
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
                placeholder={item.fileName}
                placeholderTextColor={Color1}
                style={styles.input}
                value={item.fileName || 'No name'}
                disabled
              />
              <TouchableOpacity
                style={{
                  width: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#E4F7F5',
                  height: '80%',
                  borderRadius: 5,
                  margin: 5,
                }}
                onPress={() => {
                  this.props.onPress(item.filePath);
                }}>
                <CustomFastImage
                  resizeMode={'contain'}
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  source={require('../../assets/download.png')}
                />
              </TouchableOpacity>
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
                  this.props.onPress2(item);
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
            </HStack>
          </View>
        </TouchableWithoutFeedback>
      </View>
    ) : null;
  };
  //"FileType": "application/pdf"
  render() {
    if (this.props.Success) {
      Toast.showSuccess('Download Completed');
    }
    return (
      <NativeBaseProvider>
        <SafeAreaView style={styles.container}>
          <Loader Loading={this.props.Loader} />

          <View style={{flex: 1, width: ScreenWidth - 50}}>
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
                <Text style={styles.label}>{'Attachments'}</Text>
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
            <CommonFlatlist
              refreshing={this.state.refreshing}
              //_onRefresh={this._onRefresh.bind(this)}
              _onRefresh={() => {
                this.setState({refreshing: false});
              }}
              renderItem={this.renderItem}
              data={this.props.Arr}
              Loader={false}
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
    borderColor: 'transparent',
    borderWidth: 0,
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
