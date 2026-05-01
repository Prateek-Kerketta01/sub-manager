import "@/global.css";
import { Link } from "expo-router";
import { Text } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-xl font-bold text-success">
        Welcome to Nativewind!
      </Text>
      <Link
        href={"/onboarding"}
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Go to onBoarding
      </Link>
      <Link
        href={"/(auth)/signIn"}
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Go to Sign in
      </Link>
      <Link
        href={"/(auth)/signUp"}
        className="mt-4 rounded bg-primary text-white p-4"
      >
        Go to Sign up
      </Link>

      <Link href={"/subscriptions/spotify"}>Spotify Subscription</Link>
      <Link
        href={{
          pathname: "/subscriptions/[id]",
          params: { id: "claude" },
        }}
      >
        {" "}
        Claude Max Subscription
      </Link>
    </SafeAreaView>
  );
}
