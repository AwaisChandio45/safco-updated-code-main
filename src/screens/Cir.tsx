import React from 'react'
import { SafeAreaView, Pressable, StyleSheet, View } from 'react-native'
import { AppStatusBar, HeaderwithoutDialoge } from '../components'
import {WebView} from 'react-native-webview'
import { TextView } from '../components'
import { GlobalStyles } from '../theme'
import { Colors } from '../theme'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Customprogress from '../components/Customprogress'
import { cir_url } from '../apis_auth/baseUrl'
const Cir = ()=>{
    
    const [mainUrl, setMainUrl] = React.useState({
        uri: cir_url,
        webview:''
    });
    const[loading,setLoading]=React.useState(true)
    return(
        <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
            <AppStatusBar></AppStatusBar>

            <View style={GlobalStyles.row}>
                <HeaderwithoutDialoge Theme={Colors} back={true} screenNo={2}></HeaderwithoutDialoge>
                <TextView
                type={'mini_heading22'}
                style={{paddingHorizontal: 30, marginTop: 55}}
                text="CIR"></TextView>
                <Ionicons 
                name={"refresh"}
                key="comp2"
                size={28} 
                color={Colors.parrotGreenColor} 
                style={{ paddingHorizontal: 30,marginTop: 50}}
                onPress={
                    () => {
                      setLoading(true)
                      if (mainUrl.uri == cir_url) {
                        mainUrl.webview.reload();
                      } else {
                        // setMainUrl({
                        //   uri: cir_url
                        // });
                      }
                    }
                  }
                
                /> 
            

            </View>
            {loading && <Customprogress color={Colors.parrotGreenColor}/>}

            <WebView 
            key="comp1" 
            source={{uri:mainUrl.uri}}
            ref={ref => {mainUrl.webview = ref}}
            onLoad={e => {
              setLoading(false)
              mainUrl.uri = e.nativeEvent.url}}
            startInLoadingState={true}
            scalesPageToFit={false}
             />
        </SafeAreaView> 
    )
}

const styles = StyleSheet.create({
});


export default Cir