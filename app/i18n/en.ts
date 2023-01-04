const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
  },
  createContact: {
    title:"New Contact",
    message: "Add a new Contact",
    name: {
      label: "Contact Name",
      placeholder: ""
    },
    id: {
      label: "Contact ID",
      placeholder: ""
    } ,
    btSave: "Save Contact",
    btScan: "Scan Contact"
  },
  createIdentity: {
    message: `Welcome to (still no name)
thank's for testing this new messenger
joining is very easy just pick a name and you are good to go.
    `,
    instruction: "Please pick a name",
    join: "Join"
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle:
      "This is the screen that your users will see in production when an error is thrown. You'll want to customize this message (located in `app/i18n/en.ts`) and probably the layout as well (`app/screens/ErrorScreen`). If you want to remove this entirely, check `app/app.tsx` for the <ErrorBoundary> component.",
    reset: "RESET APP",
  },
  emptyStateComponent: {
    generic: {
      heading: "So empty... so sad",
      content: "No data found yet. Try clicking the button to refresh or reload the app.",
      button: "Let's try this again",
    },
  },
}

export default en
export type Translations = typeof en
