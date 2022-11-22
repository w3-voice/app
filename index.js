// This is the first file that ReactNative will run when it starts up.
// If you use Expo (`yarn expo:start`), the entry point is ./App.js instead.
// Both do essentially the same thing.

import App from "./app/app.tsx"
import React from "react"
import { AppRegistry } from "react-native"
import RNBootSplash from "react-native-bootsplash"
import { Provider as PaperProvider } from 'react-native-paper'

function IgniteApp() {
  console.log("index js called")
  return (
    <PaperProvider>
      <App hideSplashScreen={RNBootSplash.hide} />
    </PaperProvider>
  )
}

AppRegistry.registerComponent("HelloWorld", () => IgniteApp)
export default App
