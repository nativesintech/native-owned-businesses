/* TODO(nsahler): Find a way to use tailwind for this */
export const COLOR_LOCATION_MARKER = '#edf2f7'

export const AUTH_URL = 'https://auth.bynatives.app'
export const CONTEXT_LOGGED_IN = {
  headers: { 'x-hasura-role': 'user' }
}

export const SaveStates = Object.freeze({
  SAVING: 1,
  ERROR: 2,
  SUCCESS: 3
})
