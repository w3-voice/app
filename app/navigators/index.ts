export * from "./AppNavigator"
export * from "./navigationUtilities"
// export other navigators from here
export * from "./ChatNavigator"
import { StackActions } from '@react-navigation/native'


export const resetNavigation = (screenName)=>StackActions.replace(screenName, {params: {}});