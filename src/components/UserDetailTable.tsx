import React from 'react';
import { View, Pressable, StyleSheet, Image, Dimensions } from 'react-native';
import { TextView } from '.';
import { Colors } from '../theme';


const {width, height} = Dimensions.get('window')



const UserDetailTable =({labelOne, labelTwo, valueOne, valueTwo, rowtwo=false, imageRow=false, colOneImage, colTwoImage })=>{

    const [error,setError]=React.useState(false)

    const _onImageLoadError = (event) => {
        setError(true)
    }

    return(
        <View style={styles.table}>
            
            {imageRow?

                <View style={rowtwo?styles.rowTwo : styles.rowOne}>
                                            
                <View style={styles.columnOne}>
                    
                        <TextView  text={labelOne} style={styles.label} />
                        
                        <View >
                        
                            {/* {colOneImage&& */}


                            {error==false ?
                                <Image
                                    onError={_onImageLoadError}
                                        source={colOneImage==""?require('../assests/images/placeholder.png'):{uri: colOneImage}}
                                        style={{width: '90%', height:height/3, resizeMode: 'contain'}}
                                    />
                                    :
                                    <Image
                                        source={require('../assests/images/placeholder.png')}
                                        style={{width: '90%', height:height/3, resizeMode: 'contain', marginTop:10}}
                                    />
                                }


                            {/* } */}

                            
                        
                        </View>
                        
                </View>

                <View style={styles.columnTwo}>
                    
                        <TextView  text={labelTwo} style={styles.label} />
                        
                        <View>

                            {/* {colTwoImage&& */}
                            
                            {error==false ?
                                <Image
                                    onError={_onImageLoadError}
                                        source={colTwoImage==""?require('../assests/images/placeholder.png'):{uri: colTwoImage}}
                                        style={{width: '90%', height:height/3, resizeMode: 'contain', marginTop:10}}
                                    />
                                    :
                                    <Image
                                        source={require('../assests/images/placeholder.png')}
                                        style={{width: '90%', height:height/3.5, resizeMode: 'contain', marginTop:10}}
                                    />
                                }
                                
                                
                                
                            {/* } */}
                        
                        
                        </View>
                        
                </View>


                </View>

                :


                <View style={rowtwo?styles.rowTwo : styles.rowOne}>
                                
                <View style={styles.columnOne}>

                    <TextView  text={labelOne} style={styles.label} />
                    
                    <View>
                        
                        <TextView text={valueOne} style={styles.value} />
                    
                    </View>
                    
                </View>

                <View style={styles.columnTwo}>

                    <TextView  text={labelTwo} style={styles.label} />
                    
                    <View>
                        
                        <TextView text={valueTwo} style={styles.value} />
                    
                    </View>
                    
                </View>

                </View>
                
        
            }

            

        </View>
    )
}

const styles = StyleSheet.create({
    dataContainer: {

        padding:10
    },
    table:{marginTop:10,},
    imageContainer:{
        marginTop:10
    },
    rowOne:{flexDirection:'row',backgroundColor:'#cdcdcd',borderRadius:5 },
    rowTwo:{flexDirection:'row', backgroundColor:'#f1f1f1',borderRadius:5 },
    value:{fontSize:12, color:'#000' },
    columnOne:{flex:1, borderColor:'#cdcdcd', borderRightWidth:0.2, padding:8},
    label:{fontSize:12, color:'#000', fontWeight:'bold'},
    columnTwo:{flex:1, padding:8},
    addAssetBtn:{
        backgroundColor:Colors.green,
        padding:10,
        borderRadius:10,
        elevation:10,
    }
})

export default UserDetailTable