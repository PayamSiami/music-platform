import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthStore } from "@/store/auth";

const ACCENT = "#6B38D4";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const signIn = useAuthStore((state) => state.signIn);
  const submitting = useAuthStore((state) => state.submitting);
  const error = useAuthStore((state) => state.error);
  const configured = useAuthStore((state) => state.configured);

  const canSubmit =
    email.trim().length > 0 &&
    password.length > 0 &&
    !submitting &&
    configured;

  const onSubmit = async () => {
    if (!canSubmit) return;

    const ok = await signIn(email.trim(), password);

    if (ok) router.replace("/");
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={0}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={Platform.OS === "ios"}
          >
            {/* Brand */}
            <View style={styles.brand}>
              <View style={styles.logo}>
                <Feather name="music" size={28} color="#FFF" />
              </View>

              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Sign in to keep listening
              </Text>
            </View>

            {/* Firebase Configuration Notice */}
            {!configured && (
              <View style={styles.notice}>
                <Feather
                  name="alert-triangle"
                  size={16}
                  color="#F5A524"
                />
                <Text style={styles.noticeText}>
                  Firebase is not configured. Add the
                  EXPO_PUBLIC_FIREBASE_* values to your .env file.
                </Text>
              </View>
            )}

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>

              <View style={styles.inputWrap}>
                <Feather
                  name="mail"
                  size={18}
                  color="#8A8A95"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#6B6B76"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  returnKeyType="next"
                  editable={!submitting}
                  smartInsertDelete={false}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>

              <View style={styles.inputWrap}>
                <Feather
                  name="lock"
                  size={18}
                  color="#8A8A95"
                  style={styles.inputIcon}
                />

                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#6B6B76"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="current-password"
                  returnKeyType="go"
                  onSubmitEditing={onSubmit}
                  editable={!submitting}
                />

                <Pressable
                  onPress={() =>
                    setShowPassword((value) => !value)
                  }
                  hitSlop={10}
                  style={styles.eyeButton}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={18}
                    color="#8A8A95"
                  />
                </Pressable>
              </View>
            </View>

            {/* Error */}
            {error && (
              <View
                style={styles.error}
                accessibilityLiveRegion="polite"
              >
                <Feather
                  name="alert-circle"
                  size={16}
                  color="#FF6B6B"
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Sign In Button */}
            <Pressable
              style={[
                styles.submit,
                !canSubmit && styles.submitDisabled,
              ]}
              onPress={onSubmit}
              disabled={!canSubmit}
              accessibilityRole="button"
            >
              {submitting ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitText}>Sign in</Text>
              )}
            </Pressable>

            {/* Register Navigation */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don&apos;t have an account?
              </Text>

              <Pressable
                onPress={() => router.push("/register")}
                disabled={submitting}
                hitSlop={8}
                accessibilityRole="button"
              >
                <Text style={styles.registerLink}> Sign up</Text>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0F",
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },

  // Brand
  brand: {
    alignItems: "center",
    marginBottom: 36,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
  },
  subtitle: {
    color: "#888",
    fontSize: 14,
  },

  // Fields
  field: {
    marginBottom: 18,
  },
  label: {
    color: "#B0B4BA",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161620",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#24242E",
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
    height: "100%",
  },
  passwordInput: {
    paddingRight: 8,
  },
  eyeButton: {
    padding: 6,
  },

  // Notice
  notice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 165, 36, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  noticeText: {
    color: "#F5C77E",
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },

  // Error
  error: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: "#FF9A9A",
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },

  // Submit
  submit: {
    backgroundColor: ACCENT,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Register Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 26,
  },
  footerText: {
    color: "#888",
    fontSize: 14,
  },
  registerLink: {
    color: "#A78BFA",
    fontSize: 14,
    fontWeight: "600",
  },
});
