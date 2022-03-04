import React, {Component} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {styles} from '../../auth/style';
import config from '../../config/config';
export class CustomButton extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let {onPress, title, color, width} = this.props;
    return (
      <TouchableOpacity
        style={[
          styles.loginButton,
          {
            backgroundColor: color ? color : config.themeColor,
            width: width ? width : '50%',
          },
        ]}
        onPress={() => {
          onPress();
        }}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    );
  }
}
