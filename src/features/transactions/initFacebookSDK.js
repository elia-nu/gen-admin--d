const initFacebookSDK = () => {
  return new Promise((resolve) => {
    // Wait for the window.fbAsyncInit function to be defined
    const handleFbAsyncInit = function () {
      // Parse and render the Facebook markup
      FB.XFBML.parse();
      resolve();
    };

    const facebookSDK = window.document.createElement("script");
    facebookSDK.src = "https://connect.facebook.net/en_US/sdk.js";
    facebookSDK.id = "facebook-jssdk";
    facebookSDK.async = true;

    // Configure the Facebook SDK
    window.fbAsyncInit = handleFbAsyncInit;

    // Add the Facebook SDK script to the document
    const firstScript = window.document.getElementsByTagName("script")[0];
    firstScript.parentNode.insertBefore(facebookSDK, firstScript);

    // Once the script is loaded, the fbAsyncInit function will be called
    window.fbAsyncInit();
  });
};

export default initFacebookSDK;
