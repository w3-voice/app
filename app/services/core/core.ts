/**
 * This Api class lets you interact with messenger core
 */
import {
  BeeCoreInstance,
  create
} from "./real"
// import Config from "../../config"


/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  beeCore: BeeCoreInstance
  // config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor() {
    // this.config = config
    this.beeCore = create()
  }

}

// Singleton instance of the API for convenience
export const api = new Api()
