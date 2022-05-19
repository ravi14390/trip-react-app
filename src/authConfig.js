export const msalConfig = {
    auth: {
      clientId: "3a485eeb-93e6-4639-89aa-95549fc58eb4",
      authority: "https://login.microsoftonline.com/b6fe8f38-a2cb-4902-832f-1f65836c9c82", // This is a URL (e.g. https://login.microsoftonline.com/{your tenant ID})
      redirectUri: "https://tripmanagementreactapp.azurewebsites.net",
    },
    cache: {
      cacheLocation: "localStorage", // This configures where your cache will be stored
      storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    }
  };
  
  // Add scopes here for ID token to be used at Microsoft identity platform endpoints.
  export const loginRequest = {
   scopes: ["api://34c871e9-02e6-4596-8f94-4acb486a8b3b/api.scope"]
  };