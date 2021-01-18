import { parse as gqlParse } from 'graphql'
import { parse } from 'gotql/dist/modules/parser'

const BUSINESS_FIELDS = [
  'id', 'name', 'short_description', 'long_description',
  {
    locations: { fields: ['id', 'location', 'name', 'postal_address'] }
  }, {
    territories: { fields: [{
      territory: {
        fields: ['id', 'name', 'description_url']
      }
    }] }
  }, {
    image_assets: {
      fields: ['src', 'width', 'height', 'alt']
    }
  }, {
    tags: {
      fields: [{
        tag: {
          fields: ['id', 'name']
        }
      }]
    }
  }
]

export const GET_BUSINESS_BY_ID = gqlParse(parse({
  variables: {
    id: { type: 'uuid', value: 'ignore' }
  },
  operation: {
    name: 'businesses',
    alias: 'business',
    args: {
      where: { id: { _eq: '$id' } }
    },
    fields: BUSINESS_FIELDS
  }
}, 'query'))

export const getBusinessQuery = (query, affiliations, tags) => {
  const filters = {}
  const args = {}
  const textSearch = query && query.trim().length > 0

  if (affiliations.length > 0) {
    filters.territories = { territory: { id: {
      _in: '$affiliations'
    } } }
  }

  if (tags.length > 0) {
    filters.tags = { tag_id: { _in: '$tags' } }
  }

  if (query) {
    args.args = { search: '$query' }
  }

  args.where = filters

  const parsed = parse({
    variables: {
      query: { type: 'String', value: '!' },
      affiliations: { type: '[String!]', value: ' ' },
      tags: { type: '[bigint!]', value: ' ' }
    },
    operation: {
      name: textSearch ? 'search_businesses' : 'businesses',
      alias: 'businesses',
      args,
      fields: BUSINESS_FIELDS
    }
  }, 'query')
  console.log(parsed)
  return gqlParse(parsed)
}

export const GET_TAGS = gqlParse(parse({
  operation: {
    name: 'tags',
    fields: ['name', 'id']
  }
}, 'query'))

export const GET_TERRITORIES = gqlParse(parse({
  operation: {
    name: 'territories',
    fields: ['id', 'name', 'description_url']
  }
}, 'query'))

export const GET_LOGGED_IN_USER_BUSINESSES = gqlParse(parse({
  operation: {
    name: 'businesses',
    fields: BUSINESS_FIELDS
  }
}, 'query'))

/* const GET_TERRITORIES = gql`
query($name: String!) {
  territories(where: { name: { _similar: $name }}) {
    id
    name
    description_url
  }
}` */

// territories: {
//   query: GET_TERRITORIES,
//   variables () {
//     return { name: `%${this.search_affiliation}%` }
//   }
// }
