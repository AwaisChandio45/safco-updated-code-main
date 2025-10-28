import React from 'react'
import { SafeAreaView, Pressable, StyleSheet, View } from 'react-native'
import { AppStatusBar, HeaderwithoutDialoge } from '../components'
import { WebView } from 'react-native-webview'
import { TextView } from '../components'
import { GlobalStyles } from '../theme'
import { Colors } from '../theme'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Customprogress from '../components/Customprogress';
import { cib_url } from '../apis_auth/baseUrl'

const Cib = ()=>{
    const [mainUrl, setMainUrl] = React.useState({
        uri: cib_url,
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
                text="CIB"></TextView>
                <Ionicons 
                name={"refresh"}
                key="comp2"
                size={28} 
                color={Colors.parrotGreenColor} 
                style={{ paddingHorizontal: 30,marginTop: 50}}
                onPress={
                    () => {
                      setLoading(true)
                      if (mainUrl.uri == cib_url) {
                        mainUrl.webview.reload();
                      } else {
                        // setMainUrl({
                        //   uri: cib_url
                        // });
                      }
                    }
                  }
                
                /> 
            



      </View>
      {loading && <Customprogress color={Colors.parrotGreenColor} />}

      <WebView
        key="comp1"
        source={{ uri: mainUrl.uri }}
        ref={ref => { mainUrl.webview = ref }}
        onLoad={e => {
          setLoading(false)
          mainUrl.uri = e.nativeEvent.url
        }}
        startInLoadingState={true}
        // injectedJavaScript={`const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=0.5, maximum-scale=0.5, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `}
        scalesPageToFit={false}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
});


export default Cib