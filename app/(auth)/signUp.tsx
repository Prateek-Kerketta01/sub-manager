import { useAuth, useSignUp } from "@clerk/expo";
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

const SignUp = () => {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { signUp, errors, fetchStatus } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [formError, setFormError] = useState("");
  const [localErrors, setLocalErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    code?: string;
  }>({});

  const isSubmitting = fetchStatus === "fetching";
  const needsVerification = useMemo(
    () =>
      signUp?.status === "missing_requirements" &&
      signUp?.unverifiedFields?.includes("email_address") &&
      signUp?.missingFields?.length === 0,
    [signUp?.status, signUp?.unverifiedFields, signUp?.missingFields],
  );

  const handleSubmit = async () => {
    setFormError("");
    setLocalErrors({});

    const nextErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    if (!emailAddress.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!EMAIL_REGEX.test(emailAddress.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Create a password.";
    } else if (password.length < 8) {
      nextErrors.password = "Use at least 8 characters.";
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setLocalErrors(nextErrors);
      return;
    }

    const { error } = await signUp.password({
      emailAddress: emailAddress.trim(),
      password,
    });

    if (error) {
      setFormError(
        error.longMessage ||
          error.message ||
          "Unable to create your account. Please try again.",
      );
      return;
    }

    if (signUp?.status === "complete") {
      await signUp.finalize({
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
    } else if (!needsVerification) {
      const { error: sendEmailError } =
        await signUp.verifications.sendEmailCode();
      if (sendEmailError) {
        setFormError(
          sendEmailError.longMessage ||
            sendEmailError.message ||
            sendEmailError.code ||
            "Unable to send verification email",
        );
        return;
      }
    }
  };

  const handleVerify = async () => {
    setFormError("");
    setLocalErrors({});

    if (!code.trim()) {
      setLocalErrors({ code: "Enter the verification code." });
      return;
    }

    const { error: verifyError } = await signUp.verifications.verifyEmailCode({
      code: code.trim(),
    });

    if (verifyError) {
      setFormError(
        verifyError.longMessage ||
          verifyError.message ||
          "We couldn’t verify that code. Please try again.",
      );
      return;
    }

    if (signUp?.status === "complete") {
      await signUp.finalize({
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
            <Text className="auth-title">Create your account</Text>
            <Text className="auth-subtitle">
              Secure your billing dashboard with a custom login flow built for
              modern teams.
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
                    localErrors.email || errors.fields?.emailAddress
                      ? "auth-input-error"
                      : ""
                  }`}
                />
                <Text className="auth-error">
                  {localErrors.email || errors.fields?.emailAddress?.message}
                </Text>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a secure password"
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

              <View className="auth-field">
                <Text className="auth-label">Confirm password</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  placeholderTextColor="#8d8d8d"
                  secureTextEntry
                  autoCapitalize="none"
                  className={`auth-input ${localErrors.confirmPassword ? "auth-input-error" : ""}`}
                />
                <Text className="auth-error">
                  {localErrors.confirmPassword}
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
                  <Text className="auth-error">
                    {localErrors.code || errors.fields?.code?.message}
                  </Text>
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
                    ? "Verify email"
                    : isSubmitting
                      ? "Creating account…"
                      : "Create account"}
                </Text>
              </Pressable>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/signIn">
                <Text className="auth-link">Sign in</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
