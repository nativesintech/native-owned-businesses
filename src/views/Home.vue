<template>
  <div class="home">
    <div class="info" v-if="!is_embedded">
      <h1>Find Native-Owned Businesses</h1>
      <p>Nori grape silver beet broccoli kombu beet greens fava bean potato  quandong celery. Bunya nuts black-eyed pea prairie turnip leek lentil  turnip greens parsnip. Sea lettuce lettuce water chestnut eggplant  winter purslane fennel azuki bean earthnut pea sierra leone bologi leek  soko chicory celtuce parsley jícama salsify.</p>
    </div>
    <div class="search" ref="hidebar" :style="search_offset" v-if="!$route.query.hide_search">
      <div class="query" ref="search">
        <transition>
          <SearchInput
            label="Help me find native-owned"
            placeholder="Restaurants..."
            :update="(v) => $set( this, 'search_query', v )"
            v-if="!all_businesses"
          />
        </transition>
        <div class="filters">
          <ToggleSearch
            class="transition-fade-in-down"
            text="all types of business"
            :onchange="(v) => $set( this, 'all_businesses', v )"/>
          <transition>
            <ToggleSearch
              class="transition-fade-in-down"
              v-if="minimum_search_criteria"
              text="by location"
              search="true"
              :onchange="(v) => $set( this, 'search_location', v )"/>
          </transition>
          <transition>
            <v-select
              class="delay-100ms transition-fade-in-down"
              v-if="minimum_search_criteria"
              placeholder="Tribal affiliation (e.g. Osage)"
              v-model="search_affiliations"
              multiple
              :options="territories"
              label="name"
            />
          </transition>
          <transition>
            <v-select
              class="delay-100ms transition-fade-in-down"
              placeholder="Tags (e.g. Food)"
              v-model="search_tags"
              multiple
              :options="tags"
              label="name"
            />
          </transition>
        </div>
      </div>
      <div class="final-query">
        <div class="query-text">
          <transition>
            <span>
              <span v-if="minimum_search_criteria">Showing</span>
              <span v-if="all_businesses" class="query-detail"> all businesses</span>
              <span v-else-if="search_query"> results for <span class="query-detail">"{{search_query}}"</span></span>
            </span>
          </transition>
          <transition>
            <span v-if="minimum_search_criteria && search_location">
              in <span class="query-detail">{{search_location}}</span>
            </span>
          </transition>
          <!-- TODO(nsahler): i18n friendly -->
          <span v-if="minimum_search_criteria && search_affiliations.length > 0">
            affiliated with the
              <span
                v-for="(nation, i) in search_affiliations"
                :key="i"
              >
                <span class="query-detail">{{nation.name}}</span>
                <span v-if="i + 1 < search_affiliations.length">, </span>
            </span> nation<span v-if="search_affiliations.length > 1">s</span>...
          </span>
        </div>
        <transition>
        <button
          v-if="is_scrolled_down"
          class="toggle-search"
          @click="toggle_search">{{show_search ? 'hide' : 'show' }}</button>
        </transition>
      </div>
    </div>
    <SearchResults
      class="search-results"
      v-if="minimum_search_criteria && businesses"
      :businesses="minimum_search_criteria ? businesses : []"
    />
    <transition>
      <Loader class="transition-fade-in-down" v-if="minimum_search_criteria && !businesses"/>
    </transition>
  </div>
</template>

<script>
import 'vue-select/dist/vue-select.css'
import SearchInput from '@/components/SearchInput'
import ToggleSearch from '@/components/ToggleSearch'
import SearchResults from '@/components/SearchResults'
import Loader from '@/components/Loader'

import {
  GET_BUSINESSES,
  GET_TAGS,
  GET_TERRITORIES
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
    SearchInput,
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
      return (this.all_businesses || this.search_query)
    },
    search_offset () {
      let height = this.show_search ? -1 : -this.$refs.search.getBoundingClientRect().height - 1
      return `top: ${height}px`
    },
    is_embedded () {
      return this.$route.query.embed
    }
  },
  apollo: {
    businesses: {
      query () {
        return GET_BUSINESSES
      },
      variables () {
        const query = this.search_query
        const affiliations = this.search_affiliations.length > 0 ? this.search_affiliations.map(a => a.id) : null
        const allBusinesses = this.all_businesses
        return { allBusinesses, query, affiliations }
      }
    },
    tags: GET_TAGS,
    territories: {
      query: GET_TERRITORIES
    }
  }
}
</script>

<style lang="scss">
  @import '@/styles/variables.scss';

  $cubic: cubic-bezier(.65,.05,.36,1);

  .delay-100ms {
    transition-delay: 100ms !important;
  }

  .transition-fade-in-down {
    transition: opacity 500ms $cubic, transform 500ms $cubic;
    transform: translate3d(0, 0, 0);
    opacity: 1;

    &.v-enter,
    &.v-leave-to {
      opacity: 0;
      transform: translate3d(0, 10px, 0);
    }
  }

  .home {
    display: flex;
    flex-flow: column;
    text-align: left;
    font-family: 'Open Sans', sans-serif;

    h1 {
      font-weight: 700;
      letter-spacing: 2px;
      font-size: 40px;
      margin-bottom: 0px;
      margin-top: 0px;
    }

    .toggle-input, .v-select {
      margin-bottom: 15px;
    }

    .v-select {
      min-width: 250px;
      max-width: 500px;
      margin-right: 15px;

      .vs__dropdown-toggle {
        border-color: #151515;
        border-radius: 0px;

        .vs__selected {
          border-radius: 0;
          background: #FEFEFE;
          // padding: 2px 5px;
          color: #555;
        }
      }
    }

    .filters {
      display: flex;
      flex-flow: row wrap;
      padding-bottom: 15px;

      .toggle-input {
        margin-right: 15px;
      }
    }

    .info {
      p { color: #555; }

      transition: opacity 500ms $cubic, margin 500ms $cubic;
      padding: 15px 0;

      &.v-enter,
      &.v-leave-to {
        opacity: 0;
        margin-top: -100%;
      }
    }

    .search {
      display: flex;
      flex-flow: column;
      border-bottom: 1px dashed #959595;
      border-top: 1px dashed #959595;

      position: sticky;
      top: -1px;
      background: #FFF;
      padding: 15px 0;
      transition: top 200ms $cubic;
    }

    .final-query {
      font-weight: 700;
      font-size: 18px;
      display: flex;
      flex-flow: row;

      .query-text {
        flex: 1;

        .query-detail {
          color: #959595;
        }

        span {
          transition: opacity 500ms $cubic, margin 500ms $cubic;
        }

        span.v-enter,
        span.v-leave-to {
          opacity: 0;
          margin-top: -100%;
        }
      }

      .toggle-search {
        align-self: flex-end;
        border: 1px solid $fill_color;
        padding: 5px 10px;
        box-sizing: border-box;
        font-size: $font_size;
        background-color: #FFF;

        &:focus {
          outline: none;
          border-color: $fill_color;
        }

        transition: opacity 500ms $cubic;

        &.v-enter,
        &.v-leave-to {
          opacity: 0;
        }
      }
    }
  }
</style>
