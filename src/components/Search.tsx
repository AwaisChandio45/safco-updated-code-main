import React from 'react';
import { TextInput, View ,Pressable,StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

import {useNavigation} from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { Colors } from '../theme';
import FilterModal from './FilterModal';

const Search = ({
  Theme,
  text,
  onPress,
  onFilter,
  onChangeText, 
  //onSearch, 
  filterData, 
  setFilterData,
  setSearchData,
  filtershow=true,
  Data,setData,variable,
  setNoData,setLoading
}) => {
  //****************** VARIABLE IS THAT VARIABLE WHICH IS DIFFERENTIATE METHODES  */
  //****************** VARIABLE ==1 ? SET LIST FOR CUSTOMER */
  //****************** VARIABLE ==2 ? SET LIST FOR GROUPS */
  //****************** VARIABLE ==3 ? SET LIST FOR SAFCO CUSTOMER */


const [filterModal, setFilterModal] = React.useState(false);
 return(
     
    <Card style={styles.card}>
    <View>
      <View style={styles.row}>
      <TextInput
      onChangeText={onChangeText} 
      placeholder={text}
      placeholderTextColor={"#cdcdcd"}
      blurOnSubmit={false}
      clearTextOnFocus={true}
      style={{flex:1,color:'#737373'}}></TextInput>
      <View style={styles.circle}>
      <EvilIcons name="search" 
      style={{alignSelf: 'center'}}
      color={Colors.parrotGreenColor} size={26} />
      

      </View>
      {filtershow &&

      <View style={styles.circle}>
      {/* <Feather name="filter" 
      style={{alignSelf: 'center'}}
      onPress={()=> //console.log('working') }
      color={Colors.parrotGreenColor} size={20} /> */}
      <FilterModal 
      setSearchData={setSearchData}
       filterModal={filterModal} 
       setfilterModal={setFilterModal}
        container={filterData} 
        setContainer={setFilterData}
        Data={Data}
        variable={variable}
        setData={setData}
        setNoData={setNoData}
      setLoading={setLoading}
        />
      
      </View>
}
</View>
      
    </View>
  </Card>

 )
    
};
const styles = StyleSheet.create({
    card: {
        marginTop:10,marginLeft:30,marginRight:30,paddingLeft:10,elevation:10,
      },
      row:{flexDirection:"row",alignItems:'center'},
      circle: {height:30,width:30,borderRadius:100,marginLeft:0,marginRight:10,
        justifyContent:'center',backgroundColor:'#f1f1f1'}
})
export default Search;