<template>
  <div>
    <main>
      <div
        ref="hidebar"
        :style="search_offset"
        v-if="!$route.query.hide_search"
        class="flex flex-col border-b-0 sticky bg-white p-6
        transition-all duration-200 ease-in-out shadow mb-6 rounded">
          <div ref="search" class="flex flex-col">
            <transition
              name="fade-in-down"
              mode="out-in"
            >
              <div
                v-if="!all_businesses"
                class="pb-4 flex-1 w-1/3 flex flex-col flex-grow"
              >
                <label
                  for="search-input"
                  class="text-base font-semibold m-0"
                >help me find:</label>
                <input
                  id="search-input"
                  class="border-0 border-b text-xl focus:border-gray-600
                  transition-colors focus:outline-none"
                  placeholder="Restaurants..."
                  v-model="search_query"
                />
              </div>
            </transition>
            <div class="flex flex-row flex-wrap flex-shrink">
              <ToggleSearch
                class="mb-4 lg:mb-0"
                text="all types of business"
                :onchange="(v) => $set( this, 'all_businesses', v )"
              />
                <v-select
                  class="mb-4 lg:mb-0"
                  placeholder="Tribal affiliation (e.g. Osage)"
                  v-model="search_affiliations"
                  multiple
                  :options="territories"
                  label="name"
                />
                <v-select
                  class="mb-4 lg:mb-0"
                  placeholder="Tags (e.g. Food)"
                  v-model="search_tags"
                  multiple
                  :options="tags"
                  label="name"
                />
            </div>
          </div>
          <transition name="fade-in-down">
            <button
              v-if="is_scrolled_down"
              @click="toggle_search"
              class="border py-1 px-2 box-border text-md w-48"
            >{{show_search ? 'hide' : 'show' }}</button>
          </transition>
        </div>
        <div class="font-bold text-lg whitespace-normal inline-block">
          <transition name="fade-in-down">
            <span v-if="minimum_search_criteria">Showing&nbsp;</span>
          </transition>
          <transition name="fade-in-down">
            <span key="all" v-if="all_businesses" class="text-gray-500">
              all businesses&nbsp;
            </span>
            <span v-else-if="search_query">
              results for&nbsp;
              <span class="text-gray-500">
                "{{search_query}}"
              </span>
            </span>
          </transition>
          <span v-if="minimum_search_criteria && search_location">
            in <span class="text-gray-500">{{search_location}}</span>&nbsp;
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
        </div>
        <SearchResults class="z-10" v-if="show_search_results"  :businesses="businesses"/>
          <transition v-else-if="$apollo.queries.businesses.loading" name="fade-in-left" mode="out-in" appear>
            <Loader/>
          </transition>
          <transition v-else-if="minimum_search_criteria && businesses" name="fade-in-left" mode="out-in" appear>
            <div class="py-4 text-center text-lg text-gray-700">
              <h2>No Results Found</h2>
            </div>
          </transition>
      </main>
    </div>
</template>

<script>
import 'vue-select/dist/vue-select.css'
import ToggleSearch from '@/components/ToggleSearch'
import SearchResults from '@/components/SearchResults'
import Loader from '@/components/Loader'

import {
  GET_TAGS,
  GET_TERRITORIES,
  getBusinessQuery
} from '@/queries'

export default {
  data () {
    return {
      search_query: this.$route.query.query || '',
      search_location: '',
      search_affiliations: [],
      search_tags: [],
      all_businesses: false,
      show_search: true,
      is_scrolled_down: false
    }
  },
  mounted () {
    const observer = new IntersectionObserver(
      ([e]) => {
        this.is_scrolled_down = e.intersectionRatio < 1
      }, { threshold: [1] }
    )
    observer.observe(this.$refs.hidebar)
  },
  components: {
    ToggleSearch,
    SearchResults,
    Loader
  },
  methods: {
    toggle_search () {
      this.show_search = !this.show_search
    }
  },
  computed: {
    minimum_search_criteria () {
      return this.search_query || (this.search_affiliations.length > 0) || (this.search_tags.length > 0)
    },
    search_offset () {
      let height = this.show_search ? -1 : -this.$refs.search.getBoundingClientRect().height - 1
      return `top: ${height}px`
    },
    show_search_results () {
      return this.minimum_search_criteria && this.businesses && this.businesses.length
    }
  },
  apollo: {
    businesses: {
      query () {
        return getBusinessQuery(this.search_query, this.search_affiliations, this.search_tags)
      },
      variables () {
        const query = this.search_query
        const affiliations = this.search_affiliations.length > 0 ? this.search_affiliations.map(a => a.id) : null
        const tags = this.search_tags.length > 0 ? this.search_tags.map(t => t.id) : null

        return { query, affiliations, tags }
      }
    },
    tags: GET_TAGS,
    territories: {
      query: GET_TERRITORIES
    }
  }
}
</script>