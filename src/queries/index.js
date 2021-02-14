import gql from 'graphql-tag'
import { parse } from 'gotql/dist/modules/parser'
import { literal } from 'gotql/dist/helpers/literal'

const query = (q) => gql(parse(q, 'query'))
const mutation = (q) => gql(parse(q, 'mutation'))

export const transaction = (...mutations) => {
  /* Merge multiple mutations into one transaction - since this is a Hasura-only behaviour */
  const selections = [].concat.apply([], mutations.map(mutation => mutation.definitions[0].selectionSet.selections))
  const variableDefinitions = [].concat.apply([], mutations.map(mutation => mutation.definitions[0].variableDefinitions))

  return {
    kind: 'Document',
    definitions: [{
      kind: 'OperationDefinition',
      operation: 'mutation',
      variableDefinitions,
      directives: [],
      selectionSet: { kind: 'SelectionSet', selections }
    }]
  }
}

const BUSINESS_FIELDS = [
  'id', 'name', 'short_description', 'long_description', 'external_url',
  'physical_address', 'location',
  {
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
      fields: ['business_id', 'tag_id', {
        tag: {
          fields: ['id', 'name']
        }
      }]
    }
  }, {
    owners: {
      fields: ['user_id']
    }
  }
]

export const GET_BUSINESS_BY_ID = query({
  variables: {
    id: { type: 'uuid!', value: 'ignore' }
  },
  operation: {
    name: 'businesses_by_pk',
    alias: 'business',
    args: { id: '$id' },
    fields: BUSINESS_FIELDS
  }
})

export const getBusinessQuery = (q, affiliations, tags) => {
  const filters = {}
  const args = {}
  const textSearch = q && q.trim().length > 0

  if (affiliations.length > 0) {
    filters.territories = { territory: { id: {
      _in: '$affiliations'
    } } }
  }

  if (tags.length > 0) {
    filters.tags = { tag_id: { _in: '$tags' } }
  }

  if (q) {
    args.args = { search: '$query' }
  }

  args.where = filters

  return query({
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
  })
}

export const GET_ALL_TAGS = query({
  operation: {
    name: 'tags',
    alias: 'all_tags',
    fields: ['name', 'id']
  }
})

export const GET_ALL_TERRITORIES = query({
  operation: {
    name: 'territories',
    alias: 'all_territories',
    fields: ['id', 'name', 'description_url']
  }
})

export const GET_LOGGED_IN_USER_BUSINESSES = query({
  variables: {
    owner_id: { type: 'bigint', value: '!' }
  },
  operation: {
    name: 'businesses',
    fields: BUSINESS_FIELDS,
    args: {
      where: { owners: { user_id: { _eq: '$owner_id' } } }
    }
  }
})

// const TAG_FIELDS = [ 'id', 'name' ]
const BUSINESSES_TAGS_FIELDS = [
  { returning: { fields: [{ business: { fields: BUSINESS_FIELDS } }] } }
]

/* MUTATIONS */

export const SAVE_BUSINESS = gql`
mutation (
  $business_id: uuid!
  $business: businesses_set_input!
  $tags: [businesses_tags_insert_input!]!
  $territories: [businesses_territories_insert_input!]!
) {
  delete_businesses_tags(where:{business_id:{_eq:$business_id}}) {
    affected_rows,
    returning {
      business {
        name
        tags { tag { name } } }
    }
  }
  insert_businesses_tags(objects:$tags) {
    returning {
      id
      tag_id
      business_id
    }
  }
  delete_businesses_territories(where:{business_id:{_eq:$business_id}}) {
    affected_rows,
    returning {
      business {
        name
        territories { territory { name } } }
    }
  }
  insert_businesses_territories(objects:$territories) {
    returning {
      id
      territory_id
      business_id
    }
  }
  update_businesses_by_pk(
    pk_columns: {id: $business_id }
    _set: $business) {
    id name short_description long_description
    territories { territory { id, name, description_url }}
  }
}`

/** TERRITORIES **/
export const DELETE_BUSINESSES_TERRITORIES = mutation({
  variables: {
    tag_id: { type: 'bigint', value: 'ignore' },
    business_id: { type: 'uuid', value: 'ignore' }
  },
  operation: {
    name: 'delete_businesses_tags',
    args: {
      where: {
        business_id: { _eq: '$business_id' },
        tag_id: { _eq: '$tag_id' }
      }
    },
    fields: [ 'affected_rows', ...BUSINESSES_TAGS_FIELDS ]
  }
})

export const INSERT_BUSINESSES_TERRITORIES = mutation({
  variables: {
    tags: { type: '[businesses_tags_insert_input!]!', value: 'ignore' }
  },
  operation: {
    name: 'insert_businesses_tags',
    args: {
      objects: '$tags',
      on_conflict: {
        constraint: literal`businesses_tags_business_id_tag_id_key`,
        update_columns: literal`[]`
      }
    },
    fields: [ 'affected_rows', ...BUSINESSES_TAGS_FIELDS ]
  }
})
