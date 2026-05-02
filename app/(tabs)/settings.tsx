import { useClerk } from "@clerk/expo";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="mb-6 text-2xl font-sans-bold text-primary">
        Settings
      </Text>
      <Pressable
        onPress={() => signOut()}
        className="items-center rounded-2xl bg-accent py-4"
      >
        <Text className="text-base font-sans-bold text-primary">Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
