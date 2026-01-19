interface ZoomFeatureOptions {
   video?: {
      enable: boolean;
      enforceMultipleVideos?: boolean; // only for WASM test
      originalRatio?: boolean;
      virtualBackground?: boolean;
   };
   audio?: {
      enable: boolean;
      backgroundNoiseSuppression?: boolean;
      originalSound?: boolean;
      syncButtonsOnHeadset?: boolean;
   };
   secondaryAudio?: {
      enable: boolean;
   };
   share?: {
      enable: boolean;
      // /**
      //  * Enables configuring specific content to share within supported browsers. https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_controller_option
      //  */
      // controls?: boolean;
      // /**
      //  * Enables configuring specific share surfaces within supported browsers. https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_monitortypesurfaces_option
      //  */
      // displaySurface?: boolean;
      // /**
      //  * Enables or disables the share computer audio option within supported browsers. https://caniuse.com/mdn-api_mediadevices_getdisplaymedia_systemaudio_option
      //  */
      // hideShareAudioOption?: boolean;
      // /**
      //  * Prioritizes frame rate over resolution for better screen sharing of videos.
      //  */
      // optimizedForSharedVideo?: boolean;
   };
   chat?: {
      enable: boolean;
      enableEmoji: boolean;
   };
   users?: {
      enable: boolean;
   };
   settings?: {
      enable: boolean;
   };
   recording?: {
      enable: boolean;
   };
   invite?: {
      enable: boolean;
      inviteLink?: string;
   };
   theme?: {
      enable: boolean;
      defaultTheme?: "light" | "dark" | "blue" | "green";
   };
   viewMode?: {
      enable: boolean; // enable switch view mode
      defaultViewMode: SuspensionViewValue;
      viewModes: SuspensionViewValue[];
   };
   phone?: {
      enable: boolean;
   };
   preview?: {
      enable: boolean;
      isAllowModifyName?: boolean;
   };
   feedback?: {
      // feedback after end/leave session
      enable: boolean;
   };
   troubleshoot?: {
      enable: boolean;
   };
   caption?: {
      enable: boolean;
   };
   playback?: {
      enable: boolean;
      /**
       * List of audio/video playbacks to be used in the playback feature.
       */
      audioVideoPlaybacks: AudioVideoPlaybacks[];
   };
   subsession?: {
      enable: boolean;
   };
   leave?: {
      enable: boolean;
   };
   virtualBackground?: {
      enable: boolean;
      enforceVirtualBackground?: boolean; // only for WASM test
      allowVirtualBackgroundUpload?: boolean;
      virtualBackgrounds?: {
         url: string;
         displayName?: string;
      }[];
   };
   footer?: {
      enable: boolean;
   };
   header?: {
      enable: boolean;
   };
   screenshot?: {
      video?: {
         /** Enable video-frame screenshots. @default false */
         enable: boolean; // default false
      };
      share?: {
         /** Enable shared-screen screenshots. @default false */
         enable: boolean; // default false
      };
   };
}
