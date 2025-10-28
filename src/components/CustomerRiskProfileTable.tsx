import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, } from 'react-native';
import { TextView } from '.';
import { Colors } from 'react-native-paper';

const {width, height} = Dimensions.get('window')

const CustomerRiskProfileTabel = ({
    colOneMainHeading, 
    colTwoMainHeading, 
    colThreeMainHeading, 
    colFourMainHeading,
    rowOnesubHeading,
    rowTwosubHeading,
    rowThreesubHeading,
    rowFoursubHeading,
    rowOneColOne,
    rowOneColTwo,
    rowOneColThree,
    rowTwoColOne,
    rowTwoColTwo,
    rowTwoColThree,
    rowThreeColOne,
    rowThreeColTwo,
    rowThreeColThree,
    rowFourColOne,
    rowFourColTwo,
    rowFourColThree,
})=>{
    return(
        <ScrollView horizontal={true}>
            <View>
                <View style={{flexDirection:'row', backgroundColor:'#cdcdcd', borderRadius:5}}>

                    <View style={styles.mainHeading}>
                        <TextView text={colOneMainHeading} style={{fontSize:12, fontWeight:'bold'}} />
                    </View>

                    <View style={styles.mainHeading}>
                        <TextView text={colTwoMainHeading} style={{fontSize:12, fontWeight:'bold'}} />
                    </View>

                    <View style={styles.mainHeading}>
                        <TextView text={colThreeMainHeading} style={{fontSize:12, fontWeight:'bold'}} />
                    </View>

                    <View style={styles.mainHeading}>
                        <TextView text={colFourMainHeading} style={{fontSize:12, fontWeight:'bold'}} />
                    </View>
                
                </View>
                
                <View style={{flexDirection:'row', marginTop:5,}}>
                    
                    <View style={styles.subHeadingStyle}>

                        <TextView text={rowOnesubHeading} style={{fontSize:12, fontWeight:'bold'}} />

                    </View>
                    
                    <View style={styles.column}>

                        <TextView text={rowOneColOne} style={{fontSize:12,textAlign:'center'}} />

                    </View>

                    <View style={styles.column}>

                        <TextView text={rowOneColTwo} style={{fontSize:12}} />

                    </View>

                    <View style={styles.column}>

                        <TextView text={rowOneColThree} style={{fontSize:12}} />

                    </View>
               
                </View>

                <View style={{flexDirection:'row', marginTop:5,}}>
                    
                    <View style={styles.subHeadingStyle}>

                        <TextView text={rowTwosubHeading} style={{fontSize:12, fontWeight:'bold'}} />

                    </View>
                    
                    <View style={styles.column}>

                        <TextView text={rowTwoColOne} style={{fontSize:12,textAlign:'center'}} />

                    </View>

                    <View style={styles.column}>

                        <TextView text={rowTwoColTwo} style={{fontSize:12}} />

                    </View>

                    <View style={styles.column}>

                        <TextView text={rowTwoColThree} style={{fontSize:12}} />

                    </View>
               
                </View>

                <View style={{flexDirection:'row', marginTop:5,}}>
                    
                    <View style={styles.subHeadingStyle}>

                        <TextView text={rowThreesubHeading} style={{fontSize:12, fontWeight:'bold'}} />

                    </View>
                    
                    <View style={styles.column}>

                        <TextView text={rowThreeColOne} style={{fontSize:12,textAlign:'center'}} />

                    </View>

                    <View style={styles.column}>

                        <TextView text={rowThreeColTwo} style={{fontSize:12}} />

                    </View>

                    <View style={styles.column}>

                        <TextView text={rowThreeColThree} style={{fontSize:12}} />

                    </View>
               
                </View>

                <View style={{flexDirection:'row', marginTop:5,}}>
                    
                    <View style={styles.subHeadingStyle}>

                        <TextView text={rowFoursubHeading} style={{fontSize:12, fontWeight:'bold'}} />

                    </View>
                    
                    <View style={styles.column}>

                        <TextView text={rowFourColOne} style={{fontSize:12,textAlign:'center'}} />

                    </View>

                    <View style={styles.column}>

                        <TextView text={rowFourColTwo} style={{fontSize:12}} />

                    </View>

                    <View style={styles.column}>

                        <TextView text={rowFourColThree} style={{fontSize:12}} />

                    </View>
               
                </View>
            
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    column:{padding:5, width:width/3, borderWidth:0.5, borderColor:'#cdcdcd', borderRadius:5, justifyContent:'center'},
    mainHeading:{width:width/3, padding:5, justifyContent:'center' },
    subHeadingStyle : {backgroundColor:'#cdcdcd', padding:5, width:width/3, borderRadius:5, justifyContent:'center'}
})

export default CustomerRiskProfileTabel