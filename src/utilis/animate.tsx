import { Animated, Easing } from 'react-native';

const animate = (translate, toValue, duration = 1000) => {
	Animated.timing(translate, {
		toValue,
		duration,
		easing: Easing.inOut(Easing.ease),
		useNativeDriver: true,
	}).start();
};

export default animate;
