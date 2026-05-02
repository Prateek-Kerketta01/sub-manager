import { useClerk } from "@clerk/expo";
import { styled } from "nativewind";
import { usePostHog } from "posthog-react-native";
import React, { useState } from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();
  const posthog = usePostHog();
  const [error, setError] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setError(null);
    setIsSigningOut(true);

    try {
      posthog.capture("sign_out");
      posthog.reset();
      await signOut();
    } catch (signOutError) {
      setError(
        signOutError instanceof Error
          ? signOutError.message
          : String(signOutError),
      );
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="mb-6 text-2xl font-sans-bold text-primary">
        Settings
      </Text>
      <Pressable
        onPress={handleSignOut}
        disabled={isSigningOut}
        className={`items-center rounded-2xl bg-accent py-4 ${isSigningOut ? "opacity-50" : ""}`}
      >
        <Text className="text-base font-sans-bold text-primary">
          {isSigningOut ? "Signing out…" : "Log out"}
        </Text>
      </Pressable>
      {error ? <Text className="mt-3 text-sm text-danger">{error}</Text> : null}
    </SafeAreaView>
  );
};

export default Settings;
