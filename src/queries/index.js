import gql from 'graphql-tag'

export const GET_BUSINESSES = gql`
fragment businessFields on businesses {
  id
  name
  short_description
  long_description
  locations {
    location
    name
  }
  territories {
    territory {
      id
      name
      description_url
    }
  }
  image_assets {
    src
    width
    height
    alt
  },
  tags {
    tag { id, name }
  }
}

query($allBusinesses: Boolean!, $query: String, $affiliations: [String!]) {
  businesses(where: {
    territories: { territory: { id: { 
      _in: $affiliations
    }}}
  }) @include(if: $allBusinesses) {
    ...businessFields
  }

  businesses: search_businesses(
    args: {search: $query},
    where: {
      territories: { territory: { id: { 
        _in: $affiliations
      }}}
    }
  ) @skip(if: $allBusinesses) {
    ...businessFields
  }
}
`

export const GET_TAGS = gql`
query {
  tags {
    name,
    id
  }
}`

export const GET_TERRITORIES = gql`
query {
  territories {
    id
    name
    description_url
  }
}
`

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
