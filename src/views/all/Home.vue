<template>
  <main>
    <div>
      <div
        v-if="!$route.query.hide_search"
        class="search-bar flex flex-col border-b-0 lg:sticky bg-white p-6 z-50
        transition-all duration-200 ease-in-out shadow mb-6 rounded top-0">
          <div ref="search" class="flex flex-col">
            <div class="flex flex-row flex-wrap flex-shrink align-baseline">
              <LabeledInput
                class="mr-4"
                label="Help me find"
                name="search-query"
                type="text"
                placeholder="e.g. Restaurants..."
                v-model="search_query"
              />
              <LabeledField name="tags" label="Tribal affiliation" class="lg:mb-0">
                <v-select
                  placeholder="e.g. Osage"
                  v-model="search_affiliations"
                  multiple
                  :options="all_territories"
                  label="name"
                />
              </LabeledField>
              <LabeledField name="tags" label="Tags" class="lg:mb-0">
                <v-select
                  class="lg:mb-0"
                  placeholder="e.g. Food"
                  v-model="search_tags"
                  multiple
                  :options="all_tags"
                  label="name"
                />
              </LabeledField>
            </div>
          </div>
        </div>
        <div class="font-bold text-lg whitespace-normal inline-block w-full h-5">
          <transition name="fade-in-down">
            <span v-if="minimum_search_criteria">
              <span v-if="search_query">
                Results for&nbsp;<span class="text-gray-500">"{{search_query}}"</span>
              </span>
              <span key="all" v-else-if="minimum_search_criteria">Businesses&nbsp;</span>
              <span v-if="search_location">
                in <span class="text-gray-500">{{search_location}}</span>&nbsp;
              </span>
              <span v-if="search_tags.length">
                tagged with
                <span
                  class="text-gray-500"
                  v-for="(tag, i) in search_tags"
                  :key="tag.name"
                >
                  {{tag.name}}<span v-if="i < search_tags.length - 1">,</span>&nbsp;
                </span>
              </span>
              <!-- TODO(nsahler): i18n friendly -->
              <span v-if="minimum_search_criteria && search_affiliations.length > 0">
                &nbsp;affiliated with the&nbsp;
                <span
                  v-for="(nation, i) in search_affiliations"
                  :key="i"
                >
                  <span class="text-gray-500">{{nation.name}}</span>
                  <span v-if="i + 1 < search_affiliations.length - 1">
                    ,&nbsp;
                  </span>
                  <span v-if="i + 1 === search_affiliations.length - 1">
                    &nbsp;or&nbsp;
                  </span>
                </span>
                <span>&nbsp;nation</span>
                <span v-if="search_affiliations.length > 1">s</span>...
              </span>
            </span>
            <span v-else>
              Featured Businesses
            </span>
          </transition>
        </div>
        <SearchResults :businesses="searchResults" :loading="queryIsLoading"/>
      </div>
    </main>
</template>

<script>
import 'vue-select/dist/vue-select.css'
import SearchResults from '@/components/SearchResults'
import LabeledField from '@/components/ui/LabeledField'
import LabeledInput from '@/components/ui/LabeledInput'

import {
  GET_ALL_TAGS,
  GET_ALL_TERRITORIES,
  GET_FEATURED_BUSINESSES,
  getBusinessQuery
} from '@/queries'

export default {
  data () {
    return {
      search_query: this.$route.query.query || '',
      search_location: '',
      search_affiliations: [],
      search_tags: [],
      show_search: true
    }
  },
  components: {
    SearchResults,
    LabeledField,
    LabeledInput
  },
  methods: {
    toggleSearch () {
      this.show_search = !this.show_search
    }
  },
  computed: {
    minimum_search_criteria () {
      return this.search_query || (this.search_affiliations.length > 0) || (this.search_tags.length > 0)
    },
    show_search_results () {
      return this.searchResults && this.searchResults.length
    },
    searchResults () {
      return this.minimum_search_criteria ? this.businesses : this.featured_businesses
    },
    queryIsLoading () {
      const queries = this.$apollo.queries
      const query = this.minimum_search_criteria ? queries.businesses : queries.featured_businesses
      return query.loading
    }
  },
  apollo: {
    businesses: {
      throttle: 200,
      debounce: 200,
      query () {
        return getBusinessQuery(this.search_query, this.search_affiliations, this.search_tags)
      },
      variables () {
        let query = this.search_query || undefined
        const affiliations = this.search_affiliations.length > 0 ? this.search_affiliations.map(a => a.id) : undefined
        const tags = this.search_tags.length > 0 ? this.search_tags.map(t => t.id) : undefined

        if (query) query = query.trim().replace(/\s/g, '|')

        return { query, affiliations, tags }
      }
    },
    featured_businesses: GET_FEATURED_BUSINESSES,
    all_tags: GET_ALL_TAGS,
    all_territories: GET_ALL_TERRITORIES
  }
}
</script>
