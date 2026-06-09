import Constants from "expo-constants";

const appScheme = Array.isArray(Constants.expoConfig?.scheme)
  ? Constants.expoConfig?.scheme[0]
  : Constants.expoConfig?.scheme;

const authCallbackURL = `${appScheme ?? "finn-app"}://`;

export { authCallbackURL };
