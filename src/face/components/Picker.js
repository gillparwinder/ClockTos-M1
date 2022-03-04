import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Item, Picker} from 'native-base';
import MultiSelect from 'react-native-multiple-select';
import ResponsiveSize from '../../config/ResponsiveSize';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import config from '../../config/config';

const PickerElement = (props) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    textContainer: {
      paddingHorizontal: 6,
      marginBottom: 5,
    },
    text: {
      fontFamily: 'Poppins-Regular',
      fontSize: ResponsiveSize(13),
      fontWeight: '500',
      lineHeight: 24,
      //color: '#120E66',
    },
    innerTextDropdown: {margin: '1%', height: 40},
    DropdownStyle: {
      elevation: 2,
      shadowColor: 'silver',
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 0.5,
      backgroundColor: 'white',
      borderRadius: 10,
      paddingLeft: 15,
      borderWidth: 1,
    },
    DropdownCOntainer: {
      marginTop: '4%',
      marginLeft: '4%',
      marginRight: '4%',
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{props.title}</Text>
      </View>
      {/*<Item regular style={styles.item}>
        <Picker
          enabled={props.enabled}
          note
          mode="dropdown"
          style={{width: 120}}
          selectedValue={props.selectedValue}
          onValueChange={props.onValueChange}>
          <Picker.Item label="Select" value="" key="" />
          {props.options.map((item) => {
            return (
              <Picker.Item
                label={item.itemName}
                value={item.id}
                key={item.id}
              />
            );
          })}
        </Picker>
      </Item>*/}
      <MultiSelect
        key={Math.random()}
        hideTags={props.hideTags == true ? true : false}
        styleMainWrapper={[props.style, {width: props.width}]}
        items={props.options}
        uniqueKey={props.uniqueKey}
        onSelectedItemsChange={(val) => {
          props.onValueChange(val);
        }}
        //ref={(component) => {
        //  this.multiSelect = component;
        //}}
        selectedItems={props.selectedValue}
        //selectText="Search By Batch Year "
        searchInputPlaceholderText={props.placeholder}
        //onChangeInput={(text) => {
        //  //alert(JSON.stringify(props.options));
        //}}
        altFontFamily="Poppins-Regular"
        tagRemoveIconColor={props.color}
        textColor={props.color}
        tagBorderColor={props.color}
        tagTextColor={props.color}
        selectedItemTextColor={props.color}
        selectedItemIconColor={props.color}
        itemTextColor={props.textColor}
        styleInputGroup={[styles.DropdownStyle, {paddingRight: 10, height: 40}]}
        styleDropdownMenuSubsection={[
          styles.DropdownStyle,
          {borderColor: props.color},
        ]}
        //hideSubmitButton
        //hideTags
        single={props.single == true ? true : false}
        submitButtonColor={props.color}
        itemFontSize={ResponsiveSize(config.AppAllTextSize)}
        styleTextDropdown={{
          paddingLeft: widthPercentageToDP('2'),
          fontFamily: 'Poppins:Regular',
        }}
        styleTextDropdownSelected={{paddingLeft: widthPercentageToDP('2')}}
        styleRowList={styles.innerTextDropdown}
      />
    </View>
  );
};

export default PickerElement;
