// /* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import { icons } from '../../constant';
import constant from '../../constant/constant';
import CategoryMenu from './Category';
import { StyleSheet } from 'react-native';
const Menu: React.FC = () => {
  return (
    <View style={{flex: 1,marginTop:90,marginLeft: 44}}>
      <View style ={style.container}>
        {/* o trong category menu co Props onPress  */}
      <CategoryMenu icon={icons.home_m} label={constant.screens.home} />
      <CategoryMenu icon={icons.profile_m} label={constant.screens.profile} />
      <CategoryMenu icon={icons.photo} label={constant.screens.photo} />
      </View>
     <View style ={style.container}>
     <CategoryMenu icon={icons.videos} label={constant.screens.video} />
      <CategoryMenu icon={icons.groups} label={constant.screens.group} />
      <CategoryMenu icon={icons.pages} label={constant.screens.pages} />
     </View>
     <View style ={style.container}>
     <CategoryMenu icon={icons.noti} label={constant.screens.notification} />
     <CategoryMenu icon={icons.mess} label={constant.screens.messages} />
     <CategoryMenu icon={icons.event} label={constant.screens.event} />
     </View>
     <View style ={style.container}>
     <CategoryMenu icon={icons.pages} label={constant.screens.blog} />
     </View>
    </View>
  );
};
const style = StyleSheet.create({
  container :{
    flexDirection:'row',
    justifyContent:'space-evenly',
    marginBottom: 30,
    alignItems:'center'
  }
})
export default Menu;
