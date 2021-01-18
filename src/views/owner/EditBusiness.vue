<template>
  <main>
    <input name="name" type="text" />
    <input name="location" type="text" />
    <textarea name="long-description"></textarea>
    <input name="short-description" type="text" />
    <input name="territories" type="text" />
    <input name="tags" type="text" />
   </main>
</template>
<script>
import { GET_BUSINESS_BY_ID } from '@/queries'

export default {
  props: ['business'],
  data () {
    return {
      name: undefined,
      location: undefined,
      short_description: undefined,
      long_description: undefined,
      territories: [],
      tags: []
    }
  },
  apollo: {
    business: {
      query: GET_BUSINESS_BY_ID,
      context: {
        headers: {
          'x-hasura-role': 'user'
        }
      }
    }
  }
}
</script>
