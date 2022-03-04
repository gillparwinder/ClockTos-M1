import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import DatePicker from 'react-native-datepicker';
import CustomFastImage from './CustomFastImage';

export default class CommonDatePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          flexDirection: this.props.flexDirection || 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: this.props.backgroundColor || '#F9F9F9',
          borderColor: this.props.borderColor,
        }}>
        <CustomFastImage
          resizeMode={'contain'}
          style={{width: 20, height: 20, marginHorizontal: 5}}
          source={require('../../assets/calendar.png')}
        />
        <View style={this.props.pickerStyle}>
          <DatePicker
            style={this.props.style}
            date={this.props.date}
            mode="date"
            placeholder={this.props.placeholder}
            format={this.props.format}
            //minDate="2020-01-01"
            maxDate={this.props.maxDate}
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            customStyles={{
              dateInput: {
                borderColor: 'transparent',
                marginLeft: -11,
              },
            }}
            onDateChange={(date) => {
              this.props.onDateChange(date);
            }}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({});
