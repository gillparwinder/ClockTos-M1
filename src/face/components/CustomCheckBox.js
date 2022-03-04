import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Checkbox} from 'react-native-paper';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import {AnimatedCheckBox} from '../../components/common/AnimatedCheckBox';
import config from '../../config/config';
import ResponsiveSize from '../../config/ResponsiveSize';

const CustomCheckBox = ({
  status,
  onPress,
  text,
  width,
  color,
  textColor,
  alignSelf,
}) => {
  const styles = StyleSheet.create({
    text: {
      fontFamily: config.fontFamily.regular,
      fontSize: heightPercentageToDP(2),
      lineHeight: 19,
      fontWeight: '400',
      color: textColor || '#4D76F7',
    },
  });
  return (
    <View
      style={{
        width: width ? width : '30%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderRadius: 10,
        //elevation: 2,
        paddingHorizontal: 5,
        borderWidth: 0,
        backgroundColor: 'white',
        alignSelf: alignSelf || 'center',
        alignItems: 'center',
      }}>
      {/*<Checkbox status={status} onPress={onPress} color={color || '#4D76F7'} />*/}
      <AnimatedCheckBox
        size={20}
        disableBuiltInState={true}
        isChecked={status ? true : false}
        fillColor={color || '#4D76F7'}
        //unfillColor={'white'}
        //text="Custom Checkbox"
        iconStyle={{
          borderRadius: 5,
        }}
        textStyle={{fontFamily: 'Poppins-Regular'}}
        onPress={onPress}
      />
      <Text onPress={onPress} style={styles.text}>
        {text}
      </Text>
    </View>
  );
};

export default CustomCheckBox;
