import { Stack } from "expo-router";
import { ComponentProps } from "react";
import { colors } from "./tokens";

// Derive the options type from the Stack.Screen component itself
type StackScreenOptions = NonNullable<
  ComponentProps<typeof Stack.Screen>["options"]
>;

export const StackScreenWithSearchBar: StackScreenOptions = {
  headerLargeTitle: true,
  headerLargeStyle: {
    backgroundColor: colors.background,
  },
  headerLargeTitleStyle: {
    color: colors.text,
  },
  headerTintColor: colors.text,
  headerTransparent: true,
  headerBlurEffect: "prominent",
  headerShadowVisible: false,
};
