import React, { useRef, useEffect } from 'react';
import {
	TouchableOpacity,
	TextInput,
	StyleSheet,
	Text,
	Animated,
} from 'react-native';
import animate from '../utilis/animate';
const COLORS={BLACK_COLOR:'#000000'}

const CustomTextinput = ({
	icon,
	placeholder,
	inputContainerStyles,
	value,
	inputProps,
	onChangeText,
	onBlur,
	name,
	errorText,
}) => {
	const inputRef = useRef();
	const labelRef = useRef();
	const labelAnimated = useRef(new Animated.Value(0)).current;
	const opacity = useRef(new Animated.Value(0.5)).current;
	useEffect(() => {
		if (value)
			if (value.length > 0) {
				animate(labelAnimated, -20, 300);
				animate(opacity, 1, 300);
			}
	}, [value]);

	const onFocus = () => {
		animate(labelAnimated, -20, 300);
		animate(opacity, 1, 300);
	};
	const onBlurHandler = (e) => {
		if (value.length === 0) {
			animate(labelAnimated, 0, 300);
			animate(opacity, 0.5, 300);
		}
		if (onBlur) onBlur(e);
	};
	return (
		<TouchableOpacity
			activeOpacity={1}
			style={{
				...styles.inputContainer,
				...inputContainerStyles,
			}}
			onPress={() => inputRef.current.focus()}>
			<TextInput
				ref={inputRef}
				style={{ ...styles.inputStyles }}
				value={value}
				onChangeText={onChangeText}
				{...inputProps}
				onBlur={onBlurHandler}
				onFocus={onFocus}
			/>
			<Animated.Text
				style={{
					...styles.label,
					transform: [{ translateY: labelAnimated }],
					opacity,
				}}
				ref={labelRef}
				onPress={() => inputRef.current.focus()}>
				{placeholder}
			</Animated.Text>
			<Text style={styles.error}>{errorText}</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	inputContainer: {
		// flexDirection: 'row',
		// alignItems: 'center',
		width: '100%',
		marginBottom: 30,
	},
	inputStyles: {
		fontSize: 12,
		fontFamily: 'FONT_REGULAR',
		padding: 1,
		paddingLeft: 0,
		borderBottomWidth: 0.5,
		borderBottomColor: COLORS.BLACK_COLOR,
	},
	label: {
		position: 'absolute',
		color: COLORS.BLACK_COLOR,
		padding: 1,
		paddingLeft: 0,
		top: 4,
		left: 0,
		fontSize: 12,
		fontFamily: 'FONT_REGULAR',
	},
	error: {
		color: 'red',
		fontFamily: 'FONT_LIGHT',
		fontSize: 8,
		marginTop: 0,
		width: '100%',
	},
});

export default CustomTextinput;
