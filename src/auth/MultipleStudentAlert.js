import React, {Component} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP,
} from 'react-native-responsive-screen';
import Toast from 'react-native-tiny-toast';
import {RadioButton} from 'react-native-paper';
import {Dimensions} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {CustomButton} from '../components/common/Button';
import CommonFlatlist from '../components/common/CommonFlatList';
import CustomFastImage from '../components/common/CustomFastImage';
import {Overlay} from 'react-native-elements';
import CustomCheckBox from '../face/components/CustomCheckBox';
import {AnimatedCheckBox} from '../components/common/AnimatedCheckBox';

export default class MultipleStudentAlert extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ModalVisible: false,
      isCheckBox: true,
    };
  }

  dismiss = () => {
    this.props.dismiss();
  };
  renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => this.setState({checked: item.applicationNo})}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '90%',
          alignSelf: 'center',
          height: 45,
          marginBottom: 5,
          //borderBottomWidth: 0.5,
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          disabled
          style={[Styles.photoContainer, {marginRight: 10}]}>
          {/*<RadioButton
            value={this.state.checked}
            color={'green'}
            uncheckedColor={'green'}
            status={
              this.state.checked === item.applicationNo
                ? 'checked'
                : 'unchecked'
            }
            onPress={() => this.setState({checked: item.applicationNo})}
          />*/}
          <AnimatedCheckBox
            size={20}
            disableBuiltInState={true}
            isChecked={this.state.checked === item.applicationNo ? true : false}
            fillColor={'green'}
            iconStyle={{
              borderRadius: 50,
              marginLeft: 5,
            }}
            textStyle={{
              fontFamily: 'Poppins-Regular',
            }}
            onPress={() => this.setState({checked: item.applicationNo})}
          />
        </TouchableOpacity>
        <TouchableOpacity disabled style={Styles.photoContainer}>
          <CustomFastImage
            resizeMode={'contain'}
            style={{
              width: 30,
              height: 30,
            }}
            source={require('../assets/avatar.png')}
          />
        </TouchableOpacity>
        <View style={Styles.textContainer}>
          <Text style={Styles.text}>{item.roll_no}</Text>
        </View>
        <View style={Styles.textContainer}>
          <Text style={Styles.text}>{item.stud_name}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  //"FileType": "application/pdf"
  render() {
    if (this.props.Success) {
      Toast.showSuccess('Download Completed');
    }
    return (
      <Overlay
        isVisible={this.props.ModalVisible}
        overlayStyle={{
          margin: 10,
          borderRadius: 10,
          height: heightPercentageToDP('50%'),
          //height: heightPercentageToDP(this.state.Notes ? '40%' : '70%'),
          //marginVertical: 50,
          //  backgroundColor: config.bgColor,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: '90%',
            alignSelf: 'center',
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
            style={{
              flex: 1,
              height: 40,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                fontSize: 16,
                color: '#000000',
              }}>
              {'Confirmation'}
            </Text>
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
              source={require('../assets/cross.png')}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <Text
            style={{
              fontFamily: 'Poppins-Regular',
              fontSize: 14,
              margin: 10,
              color: '#000000',
              textAlign: 'center',
            }}>
            {
              'Multiple users are linked with this mobile number. Please select your preference.'
            }
          </Text>
          {/*<View
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              marginVertical: 10,
            }}>
            <CustomCheckBox
              status={this.state.isCheckBox}
              onPress={() => {
                this.setState({isCheckBox: true});
              }}
              textColor="black"
              color={'green'}
              text={'Student'}
            />
            <CustomCheckBox
              status={!this.state.isCheckBox}
              onPress={() => {
                this.setState({isCheckBox: false});
              }}
              textColor="black"
              color={'green'}
              text={'Staff'}
            />
          </View>*/}
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
        </ScrollView>
        <View
          style={{
            //width: '100%',
            alignSelf: 'center',
            marginVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <CustomButton
            title="Submit"
            width={200}
            onPress={() => {
              this.props.onPress(
                this.state.checked,
                // this.state.isCheckBox
              );
            }}
          />
        </View>
      </Overlay>
    );
  }
}
const Styles = StyleSheet.create({
  text: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000000',
    textTransform: 'capitalize',
  },
  textContainer: {
    width: '40%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoContainer: {
    width: '10%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
