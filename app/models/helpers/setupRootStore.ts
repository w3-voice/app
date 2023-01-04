/**
 * This file is where we do "rehydration" of your RootStore from AsyncStorage.
 * This lets you persist your state between app launches.
 *
 * Navigation state persistence is handled in navigationUtilities.tsx.
 *
 * Note that Fast Refresh doesn't play well with this file, so if you edit this,
 * do a full refresh of your app instead.
 *
 * @refresh reset
 */
import { applySnapshot, IDisposer, onSnapshot } from "mobx-state-tree"
import type { RootStore } from "../RootStore"
import * as storage from "../../utils/storage"
import { api } from "../../services/core"
import coreSync from "./coreSync"

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = "root-v1"

/**
 * Setup the root state.
 */
let _disposer: IDisposer
let _subscribed = false
export async function setupRootStore(rootStore: RootStore) {
  let restoredState: any

  try {
    if (!_subscribed){
      const bonded = await api.beeCore.bindService()
      await rootStore.identityStore.loadIdentity()
      await rootStore.chatStore.loadChatList()
      coreSync(rootStore.chatStore)
      _subscribed = true;
    }
   
    
    
  } catch (e) {
    // if there's any problems loading, then inform the dev what happened
    if (__DEV__) {
      console.tron.error(e.message, null)
    }
  }
  // rootStore.chatStore.clear()
  // stop tracking state changes if we've already setup
  if (_disposer) _disposer()

  // track changes & save to AsyncStorage
  _disposer = onSnapshot(rootStore, (snapshot) => storage.save(ROOT_STATE_STORAGE_KEY, snapshot))

  const unsubscribe = () => {
    api.beeCore.unsubscribe()
    _disposer()
    _disposer = undefined
  }

  return { rootStore, restoredState, unsubscribe }
}
