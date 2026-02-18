import { useEffect } from "react";
import { Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  interpolate,
} from "react-native-reanimated";

const AnimatedTextComponent = Animated.createAnimatedComponent(Text);

export default function AnimatedText({ value, ...props }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Trigger animation whenever value changes
    progress.value = 0;
    progress.value = withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(0, { duration: 200 })
    );
  }, [value]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [1, 1.15]),
        },
      ],
      opacity: interpolate(progress.value, [0, 1], [1, 0.6]),
    };
  });

  return (
    <AnimatedTextComponent style={[{ fontSize: 18, fontWeight: "600" }, animatedStyle]} {...props}>
      ${value.toFixed(2)}
    </AnimatedTextComponent>
  );
}
