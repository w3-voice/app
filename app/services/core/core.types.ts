/**
 * These types indicate the shape of the data you expect to receive from your
 * API endpoint, assuming it's a JSON object like we have.
 */
export interface BeeCore {
  getIdentity(): Promise<Identity>
  hasIdentity(): Promise<boolean>
  newIdentity(name): Promise<Identity>
}

export interface Identity {
  _id: string
  name: string
}

