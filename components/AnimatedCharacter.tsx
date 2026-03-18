// components/AnimatedCharacter.tsx
import React, { useEffect } from 'react';
import { Image, ImageRequireSource, ImageStyle, StyleProp, TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface AnimatedCharacterProps {
  source: ImageRequireSource;
  style?: StyleProp<ImageStyle>;
  onCharacterPress?: () => void;
  hatImage?: ImageRequireSource | null;
  hatStyle?: StyleProp<ImageStyle>;
  isShaking: boolean;
  shakeIntensity?: number;
  shakeDuration?: number;
}

const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  source,
  style,
  onCharacterPress,
  hatImage,
  hatStyle,
  isShaking,
  shakeIntensity = 8,
  shakeDuration = 70,
}) => {
  const translateX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  useEffect(() => {
    if (isShaking) {
      translateX.value = withSequence(
        withTiming(-shakeIntensity, { duration: shakeDuration, easing: Easing.out(Easing.quad) }),
        withTiming(shakeIntensity, { duration: shakeDuration, easing: Easing.out(Easing.quad) }),
        withTiming(-shakeIntensity / 2, { duration: shakeDuration, easing: Easing.out(Easing.quad) }),
        withTiming(shakeIntensity / 2, { duration: shakeDuration, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: shakeDuration, easing: Easing.out(Easing.quad) })
      );
    }
  }, [isShaking, shakeIntensity, shakeDuration, translateX]);

  return (
    <TouchableOpacity onPress={onCharacterPress} activeOpacity={0.95}>
      <Animated.View style={animatedStyle}>
        <Image source={source} style={style || {}} resizeMode="contain" />
        {hatImage && (
          <Image source={hatImage} style={hatStyle} resizeMode="contain" />
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

export default AnimatedCharacter;