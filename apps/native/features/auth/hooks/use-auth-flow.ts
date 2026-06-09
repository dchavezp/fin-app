import { useForm } from "@tanstack/react-form";
import { useRouter } from "expo-router";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { authCallbackURL } from "../constants/auth-callback";
import { signInSchema, signUpSchema } from "../schemas/auth.schema";

type AuthMode = "sign-in" | "sign-up";

function useAuthFlow() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [isEmailSubmitting, setIsEmailSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  function clearError() {
    if (error) {
      setError(null);
    }
  }

  const signInForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setIsEmailSubmitting(true);
      try {
        await authClient.signIn.email(
          {
            email: value.email.trim(),
            password: value.password,
          },
          {
            onError(error) {
              setError(error.error?.message || "Failed to sign in");
            },
            onSuccess() {
              setError(null);
              formApi.reset();
              router.replace("/(drawer)");
            },
          },
        );
      } catch {
        setError("Failed to sign in");
      } finally {
        setIsEmailSubmitting(false);
      }
    },
  });

  const signUpForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      setIsEmailSubmitting(true);
      try {
        await authClient.signUp.email(
          {
            name: value.name.trim(),
            email: value.email.trim(),
            password: value.password,
          },
          {
            onError(error) {
              setError(error.error?.message || "Failed to create account");
            },
            onSuccess() {
              setError(null);
              formApi.reset();
              router.replace("/(drawer)");
            },
          },
        );
      } catch {
        setError("Failed to create account");
      } finally {
        setIsEmailSubmitting(false);
      }
    },
  });

  const activeForm = mode === "sign-in" ? signInForm : signUpForm;
  const isAnySubmitting = isEmailSubmitting || isGoogleSubmitting;
  const title = mode === "sign-in" ? "Welcome Back" : "Create Account";
  const submitLabel = mode === "sign-in" ? "Login" : "Sign Up";
  const switchLabel =
    mode === "sign-in"
      ? "Don't have an Account? Sign Up"
      : "Already have an Account? Login";
  const googleLabel =
    mode === "sign-in" ? "Sign in with Google" : "Sign up with Google";

  async function handleGoogleSignIn() {
    if (isAnySubmitting) return;

    setIsGoogleSubmitting(true);
    setError(null);

    try {
      await authClient.signIn.social(
        {
          provider: "google",
          callbackURL: authCallbackURL,
          newUserCallbackURL: authCallbackURL,
          errorCallbackURL: `${authCallbackURL}auth`,
        },
        {
          onError(error) {
            setError(error.error?.message || "Failed to sign in with Google");
          },
          onSuccess() {
            router.replace("/(drawer)");
          },
        },
      );
    } catch {
      setError("Failed to sign in with Google");
    } finally {
      setIsGoogleSubmitting(false);
    }
  }

  function toggleMode() {
    if (isAnySubmitting) return;

    setError(null);
    setMode((currentMode) =>
      currentMode === "sign-in" ? "sign-up" : "sign-in",
    );
  }

  function submitActiveForm() {
    if (isAnySubmitting) return;

    activeForm.handleSubmit();
  }

  function submitSignInForm() {
    if (isAnySubmitting) return;

    signInForm.handleSubmit();
  }

  function submitSignUpForm() {
    if (isAnySubmitting) return;

    signUpForm.handleSubmit();
  }

  return {
    activeForm,
    clearError,
    error,
    googleLabel,
    handleGoogleSignIn,
    isAnySubmitting,
    isGoogleSubmitting,
    mode,
    signInForm,
    signUpForm,
    submitActiveForm,
    submitSignInForm,
    submitSignUpForm,
    submitLabel,
    switchLabel,
    title,
    toggleMode,
  };
}

export { useAuthFlow };
