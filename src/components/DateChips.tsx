import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    View,
    Pressable
  } from 'react-native';
import { Colors } from '../theme';
import { TextView } from '.';

const DateChips = ({searchData, setSearchData,clearFilter})=>{

    return(
      <View>
        <View style={{flexDirection:'row',alignItems:'center',width:'85%',alignSelf:'center' }}>
        {searchData.map((item, index)=>{
        return(
          <View style={{
            padding:10, 
            backgroundColor:Colors.parrotGreenColor, 
            marginLeft:0, 
            flexDirection:'row',alignItems:'center',
            marginRight:10, 
            marginTop:10,
            borderRadius:20,
            }}>
              <TextView style={{fontSize:12, color:'#fff'}} text={item} />
                
            </View>
        )
      })}
    </View>
    {searchData && searchData.length>0 &&
        <View style={{flexDirection:'row',alignItems:'center',width:'85%',alignSelf:'center' }}>
          <TextView style={{flex:1}}></TextView>
          <Pressable
          onPress={clearFilter}
          >
            <View style={{flexDirection:'row',alignItems:'center'}}>
            <MaterialCommunityIcons name={"filter-remove-outline"} size={23} color={Colors.red}/>
          <TextView style={{fontSize:12,color:Colors.light_grey,marginTop:0,marginRight:10,marginLeft:5}} text="Clear Filter"></TextView>
          </View>
          </Pressable>
          </View>
        }
    </View>
    )
}
export default DateChips;