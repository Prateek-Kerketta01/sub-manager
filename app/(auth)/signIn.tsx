import { useAuth, useSignIn } from "@clerk/expo";
import { Link, Redirect, useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView as RNScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const ScrollView = styled(RNScrollView);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SignIn = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState("");
  const [localErrors, setLocalErrors] = useState<{
    email?: string;
    password?: string;
    code?: string;
  }>({});

  const isSubmitting = fetchStatus === "fetching";
  const needsVerification = useMemo(
    () =>
      signIn?.status === "needs_client_trust" ||
      signIn?.status === "needs_second_factor",
    [signIn?.status],
  );

  const handleSubmit = async () => {
    setFormError("");
    setLocalErrors({});

    const nextErrors: { email?: string; password?: string } = {};
    if (!emailAddress.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!EMAIL_REGEX.test(emailAddress.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setLocalErrors(nextErrors);
      return;
    }

    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) {
      setFormError(
        error.longMessage ||
          error.message ||
          "Unable to sign in. Please check your credentials.",
      );
      return;
    }

    if (signIn?.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http") && typeof window !== "undefined") {
            window.location.href = url;
          } else {
            router.replace(url);
          }
        },
      });
    }
  };

  const handleVerify = async () => {
    setFormError("");
    setLocalErrors({});

    if (!code.trim()) {
      setLocalErrors({ code: "Enter the verification code." });
      return;
    }

    try {
      await signIn.mfa.verifyEmailCode({ code: code.trim() });
      if (signIn?.status === "complete") {
        await signIn.finalize({
          navigate: ({ session, decorateUrl }) => {
            if (session?.currentTask) {
              return;
            }
            const url = decorateUrl("/");
            if (url.startsWith("http") && typeof window !== "undefined") {
              window.location.href = url;
            } else {
              router.replace(url);
            }
          },
        });
      }
    } catch {
      setFormError("We couldn’t verify that code. Please try again.");
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="auth-screen"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Recurly</Text>
                <Text className="auth-wordmark-sub">
                  Smart billing for modern teams
                </Text>
              </View>
            </View>
            <Text className="auth-title">Welcome back</Text>
            <Text className="auth-subtitle">
              Sign in to manage your subscriptions, track renewals, and stay on
              top of your billing.
            </Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  value={emailAddress}
                  onChangeText={setEmailAddress}
                  placeholder="you@example.com"
                  placeholderTextColor="#8d8d8d"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className={`auth-input ${
                    localErrors.email || errors.fields?.identifier
                      ? "auth-input-error"
                      : ""
                  }`}
                />
                <Text className="auth-error">
                  {localErrors.email || errors.fields?.identifier?.message}
                </Text>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#8d8d8d"
                  secureTextEntry
                  autoCapitalize="none"
                  className={`auth-input ${
                    localErrors.password || errors.fields?.password
                      ? "auth-input-error"
                      : ""
                  }`}
                />
                <Text className="auth-error">
                  {localErrors.password || errors.fields?.password?.message}
                </Text>
              </View>

              {needsVerification ? (
                <View className="auth-field">
                  <Text className="auth-label">Verification code</Text>
                  <TextInput
                    value={code}
                    onChangeText={setCode}
                    placeholder="Enter code"
                    placeholderTextColor="#8d8d8d"
                    keyboardType="numeric"
                    className={`auth-input ${localErrors.code ? "auth-input-error" : ""}`}
                  />
                  <Text className="auth-error">{localErrors.code}</Text>
                </View>
              ) : null}

              {formError ? (
                <Text className="auth-error">{formError}</Text>
              ) : null}

              <Pressable
                onPress={needsVerification ? handleVerify : handleSubmit}
                disabled={isSubmitting}
                className={`auth-button ${isSubmitting ? "auth-button-disabled" : ""}`}
              >
                <Text className="auth-button-text">
                  {needsVerification
                    ? "Verify code"
                    : isSubmitting
                      ? "Signing in…"
                      : "Continue"}
                </Text>
              </Pressable>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Recurly?</Text>
              <Link href="/signUp">
                <Text className="auth-link">Create an account</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
