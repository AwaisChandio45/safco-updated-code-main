import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, View, Pressable, Text} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import DrawerContent from './DrawerContent';
import Screens from './Screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {Colors, GlobalStyles} from '../theme';

const {interpolateNode, Extrapolate} = Animated;

const Drawer = createDrawerNavigator();

export default () => {
  const [progress, setProgress] = React.useState(new Animated.Value(0));
  const getUserData = useSelector(state => state.UserData);
  const [text, setText] = useState('Islamic Loan');
  const [imageVisible, setImageVisible] = useState(false);
  const OrganizationType = Number(getUserData?.UserData?.OrganizationType);

  useEffect(() => {
    retrieveTheme();
  }, []);

  const storeTheme = async theme => {
    try {
      await AsyncStorage.setItem('selectedTheme', theme);
    } catch (error) {
      console.error('Error storing theme:', error);
    }
  };

  const retrieveTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem('selectedTheme');
      if (theme !== null) {
        setText(theme === 'MIS' ? 'MIS Loan' : 'Islamic Loan');
        setImageVisible(theme === 'Islamic');
      }
    } catch (error) {
      console.error('Error retrieving theme:', error);
    }
  };

  const scale = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [1, 0.8],
  });
  const borderRadius = interpolateNode(progress, {
    inputRange: [0, 1],
    outputRange: [0, 16],
  });
  const animatedStyle = {borderRadius, transform: [{scale}]};

  return (
    <LinearGradient
      style={{flex: 1, position: 'relative'}}
      colors={
        OrganizationType === 2
          ? ['#00008B', '#FFD700']
          : OrganizationType === 0
          ? ['#55a630', '#F9FBED']
          : [Colors.primary, Colors.darkGreenColor]
      }
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}>
      <View style={{backgroundColor: 'gray'}}>
        {OrganizationType === 2 && (
          <Image
            source={require('../assests/images/islamiclogo.png')}
            style={[
              styles.image,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
              },
            ]}
          />
        )}
      </View>

      {OrganizationType !== 2 && (
        <Pressable style={styles.button} onPress={() => storeTheme('MIS')}>
          <Text style={styles.buttonText}>MIS Loan</Text>
        </Pressable>
      )}

      {/* pm safco work theme  */}

      <View style={{backgroundColor: 'gray'}}>
        {OrganizationType === 0 && (
          <Image
            source={require('../assests/images/loge.jpeg')}
            style={[
              styles.image_One,
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
              },
            ]}
          />
        )}
      </View>

      {OrganizationType !== 0 && (
        <Pressable style={styles.button} onPress={() => storeTheme('MIS')}>
          <Text style={styles.buttonText}>PM Loan</Text>
        </Pressable>
      )}

      <Drawer.Navigator
        drawerType="slide"
        overlayColor="transparent"
        drawerStyle={styles.drawerStyles}
        contentContainerStyle={{flex: 1}}
        drawerContentOptions={{
          activeBackgroundColor: 'transparent',
          activeTintColor: 'white',
          inactiveTintColor: 'white',
        }}
        sceneContainerStyle={{backgroundColor: 'transparent'}}
        drawerContent={props => {
          setProgress(props.progress);
          return <DrawerContent {...props} />;
        }}>
        <Drawer.Screen
          name="Screens"
          component={Screens}
          options={{style: animatedStyle}}
        />
      </Drawer.Navigator>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  stack: {
    flex: 1,
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 5,
  },
  drawerStyles: {flex: 1, width: '50%', backgroundColor: 'transparent'},
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginTop: 15,
  },
  drawerLabel: {
    color: 'white',
    marginLeft: 20,
    alignSelf: 'center',
    marginTop: 5,
  },
  circle: {borderRadius: 100, height: 40, width: 40, justifyContent: 'center'},
  circleimg: {
    borderRadius: 100,
    marginLeft: 0,
    marginTop: 50,
    height: 60,
    width: 60,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  logout: {
    height: 30,
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    alignSelf: 'center',
    marginTop: 5,
    borderRadius: 20,
    justifyContent: 'center',
  },

  button: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 100,
    borderRadius: 10,
    backgroundColor: '#130C52',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  buttonText: {color: 'white', fontSize: 14, fontWeight: '700'},
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    height: 60,
    width: 300,
    marginLeft: -60,
    marginTop: 35,
  },
  image_One: {
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
    width: '49%',
    marginTop: 25,
  },
});

// import React from 'react';
// import { Image, StyleSheet, View, Alert, Pressable, Dimensions, PermissionsAndroid } from 'react-native';
// import {
//   createDrawerNavigator,
// } from '@react-navigation/drawer';
// import { Icons, Colors, GlobalStyles } from '../theme';
// import LinearGradient from 'react-native-linear-gradient';
// import Animated from 'react-native-reanimated';
// import DrawerContent from './DrawerContent';
// import Screens from './Screens';
// const {
//   interpolateNode,
//   Extrapolate
// } = Animated;
// // screens

// const Drawer = createDrawerNavigator();

// export default () => {
//   const [progress, setProgress] = React.useState(new Animated.Value(0));
//   const scale = interpolateNode(progress, {
//     inputRange: [0, 1],
//     outputRange: [1, 0.8],
//   });

//   const borderRadius = interpolateNode(progress, {
//     inputRange: [0, 1],
//     outputRange: [0, 16],
//   });

//   const animatedStyle = { borderRadius, transform: [{ scale }] };

//   return (
//     <LinearGradient style={{ flex: 1 }} colors={[Colors.primary, Colors.darkGreenColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
//       <Drawer.Navigator
//         // hideStatusBar
//         drawerType="slide"
//         overlayColor="transparent"
//         drawerStyle={styles.drawerStyles}
//         contentContainerStyle={{ flex: 1 }}
//         drawerContentOptions={{
//           activeBackgroundColor: 'transparent',
//           activeTintColor: 'white',
//           inactiveTintColor: 'white',
//         }}
//         sceneContainerStyle={{ backgroundColor: 'transparent' }}
//         drawerContent={props => {
//           setProgress(props.progress);
//           return <DrawerContent {...props} />;
//         }}>
//         <Drawer.Screen name="Screens">
//           {props => <Screens {...props} style={animatedStyle} />}
//         </Drawer.Screen>
//       </Drawer.Navigator>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   stack: {
//     flex: 1,
//     // shadowColor: '#FFF',
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },
//     shadowOpacity: 0.44,
//     shadowRadius: 10.32,
//     elevation: 5,
//     // overflow: 'scroll',
//     // borderWidth: 1,
//   },
//   drawerStyles: { flex: 1, width: '50%', backgroundColor: 'transparent' },
//   drawerItem: { flexDirection: 'row', alignItems: 'center', marginLeft: 15, marginTop: 15 },
//   drawerLabel: { color: 'white', marginLeft: 20, alignSelf: 'center', marginTop: 5 },
//   circle: {
//     borderRadius: 100,
//     height: 40, width: 40,
//     justifyContent: 'center'
//   },
//   circleimg: {
//     borderRadius: 100, marginLeft: 0, marginTop: 50,
//     height: 60, width: 60, backgroundColor: '#FFF',
//     justifyContent: 'center'
//   },
//   logout: {
//     height: 30, width: 100,
//     flexDirection: 'row', alignItems: 'center',
//     backgroundColor: Colors.white, alignSelf: 'center', marginTop: 5,
//     borderRadius: 20, justifyContent: 'center'
//   },

// });
