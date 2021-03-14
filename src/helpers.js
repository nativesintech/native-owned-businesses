export const parseToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    return null
  }
}

export const googleToGeoJSON = ({ location }) => ({ type: 'Point', coordinates: [location.lng, location.lat] })

/* Change tags to a relation and filter out restricted tags */
/* This is non-authoritative, and would just cause an error if the user tried to write special tags */
export const SPECIAL_TAG_IDS = [4]
/* eslint-disable-next-line camelcase */
export const filterSpecialTags = ({ tag_id }) => !SPECIAL_TAG_IDS.includes(tag_id)
