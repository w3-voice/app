import { applySnapshot, flow, Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/core"
/**
 * Model description here for TypeScript hints.
 */
export const PermissionsModel = types
  .model("Permissions")
  .props({
    supported: types.boolean,
    autostart: types.boolean,
    powersave: types.boolean,
    isAsked: types.boolean,
    optimization: types.boolean
  })
  .views((self) => ({
    get done(){
      return (!self.autostart && !self.optimization && !self.powersave && !self.supported) || self.isAsked
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    load: flow(function* load() {
      const status = yield api.beeCore.permissions.status()
      console.log("load called ", status)
      self.autostart = !!status.autostart
      self.isAsked = false
      self.powersave = !!status.powersave
      self.supported = !!status.supported
      self.optimization = !!status.optimization
    }),
    doneAsking: ()=>{
      api.beeCore.permissions.doneAsking()
      self.isAsked = true
    },
    requestDisablePowerSaving: ()=>{
      api.beeCore.permissions.requestDisablePowerSaving()
      self.powersave = false;
    },
    requestEnableAutoStart: ()=>{
      api.beeCore.permissions.requestEnableAutoStart()
      self.autostart = false;
    },
    openAppInfo: ()=>{
      api.beeCore.permissions.openAppInfo()
      self.isAsked = true
    },
    openBatteryOptimization: ()=>{
      api.beeCore.permissions.openAppBatteryOptimization()
      self.optimization = false
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Permissions extends Instance<typeof PermissionsModel> {}
export interface PermissionsSnapshotOut extends SnapshotOut<typeof PermissionsModel> {}
export interface PermissionsSnapshotIn extends SnapshotIn<typeof PermissionsModel> {}
export const createPermissionsDefaultModel = () => types.optional(PermissionsModel, {
  supported:false,
  autostart: false,
  powersave: false,
  isAsked: false,
  optimization: false
})
