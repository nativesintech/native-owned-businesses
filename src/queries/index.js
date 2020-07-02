import gql from 'graphql-tag'

export const GET_ALL_BUSINESSES = gql`
query {
  businesses {
    id
    name
    short_description
    long_description
    locations {
      location
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
}`

export const GET_BUSINESSES = gql`
query($query: String!) {
  businesses: search_businesses(
    args: {search: $query}
  ){
    id
    name
    short_description
    long_description
    locations {
      location
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
}`

export const GET_TAGS = gql`
query($query: String!) {
  tags(where: { name: { _ilike: $query }}) {
    name,
    id
  }
}`
