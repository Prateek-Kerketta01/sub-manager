import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
const SafeAreaView = styled(RNSafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 p-5 bg-background">
      <Text className="text-5xl font-sans-extrabold">Home</Text>

      <Link
        href={"/onboarding"}
        className="mt-4 font-sans-bold  rounded bg-primary text-white p-4"
      >
        Go to onBoarding
      </Link>
      <Link
        href={"/(auth)/signIn"}
        className="mt-4 font-sans-bold rounded bg-primary text-white p-4"
      >
        Go to Sign in
      </Link>
      <Link
        href={"/(auth)/signUp"}
        className="mt-4 font-sans-bold rounded bg-primary text-white p-4"
      >
        Go to Sign up
      </Link>
    </SafeAreaView>
  );
}
