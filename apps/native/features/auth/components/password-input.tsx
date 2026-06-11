import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";

import { FIN_DATA_THEME } from "@/lib/constants";

const { colors, radii, sizes, spacing, typography } = FIN_DATA_THEME;

type PasswordInputProps = {
  label: string;
  value: string;
  onBlur: TextInputProps["onBlur"];
  onChangeText: NonNullable<TextInputProps["onChangeText"]>;
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
  returnKeyType?: TextInputProps["returnKeyType"];
};

function PasswordInput({
  label,
  value,
  onBlur,
  onChangeText,
  onSubmitEditing,
  returnKeyType = "done",
}: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  function togglePasswordVisibility() {
    setIsPasswordVisible((currentValue) => !currentValue);
  }

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.passwordInputShell}>
        <TextInput
          accessibilityLabel={label}
          autoComplete="password"
          onBlur={onBlur}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={label}
          placeholderTextColor={colors.muted}
          returnKeyType={returnKeyType}
          secureTextEntry={!isPasswordVisible}
          style={styles.passwordInput}
          value={value}
        />
        <Pressable
          accessibilityLabel={
            isPasswordVisible ? "Hide password" : "Show password"
          }
          accessibilityRole="button"
          accessibilityState={{ expanded: isPasswordVisible }}
          hitSlop={8}
          onPress={togglePasswordVisibility}
          style={styles.passwordToggleButton}
        >
          <Feather
            color={colors.muted}
            name={isPasswordVisible ? "eye" : "eye-off"}
            size={17}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldGroup: {
    gap: spacing.xs,
  },
  label: {
    color: colors.text,
    fontSize: typography.label,
    fontWeight: "700",
  },
  passwordInputShell: {
    alignItems: "center",
    backgroundColor: colors.input,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    flexDirection: "row",
    height: sizes.inputHeight,
    paddingHorizontal: spacing.md,
  },
  passwordInput: {
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    padding: 0,
  },
  passwordToggleButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    paddingLeft: spacing.sm,
  },
});

export { PasswordInput };
