<template>
  <div class="home">
    <div class="info">
      <h1>Find Native-Owned Businesses</h1>
      <p>Nori grape silver beet broccoli kombu beet greens fava bean potato  quandong celery. Bunya nuts black-eyed pea prairie turnip leek lentil  turnip greens parsnip. Sea lettuce lettuce water chestnut eggplant  winter purslane fennel azuki bean earthnut pea sierra leone bologi leek  soko chicory celtuce parsley jícama salsify.</p>
    </div>
    <div class="search" ref="hidebar" :style="search_offset">
      <div class="query" ref="search">
        <transition>
          <SearchInput
            label="Help me find native-owned"
            placeholder="Restaurants..."
            :update="(v) => set( 'search_query', v )"
            v-if="!all_businesses"
          />
        </transition>
        <div class="filters">
          <ToggleSearch
            class="transition-fade-in-down"
            text="all types of business"
            :onchange="(v) => set( 'all_businesses', v )"/>
          <transition>
            <ToggleSearch
              class="transition-fade-in-down"
              v-if="minimum_search_criteria"
              text="by location"
              search="true"
              :onchange="(v) => set( 'search_location', v )"/>
          </transition>
          <transition>
            <ToggleSearch
              class="delay-100ms transition-fade-in-down"
              v-if="minimum_search_criteria"
              text="by tribal affiliation"
              search="true"
              :onchange="(v) => set( 'search_affiliation', v )"/>
          </transition>
          <div class="tags">
            <button class="button-knockout" v-for="tag in tags" :key="tag.id">{{tag.name}}</button>
          </div>
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
          <span v-if="minimum_search_criteria && search_affiliation">
            affiliated with <span class="query-detail">{{search_affiliation}}</span>...
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
import SearchInput from '@/components/SearchInput'
import ToggleSearch from '@/components/ToggleSearch'
import SearchResults from '@/components/SearchResults'
import Loader from '@/components/Loader'

import {
  GET_BUSINESSES,
  GET_ALL_BUSINESSES,
  GET_TAGS
} from '@/queries'

export default {
  data () {
    return {
      search_query: '',
      search_location: '',
      search_affiliation: '',
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
    set (k, v) { this[ k ] = v },
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
    }
  },
  apollo: {
    businesses: {
      query () {
        return this.all_businesses ? GET_ALL_BUSINESSES : GET_BUSINESSES
      },
      variables () {
        return this.all_businesses ? {} : { query: this.search_query }
      }
    },
    tags: {
      query: GET_TAGS,
      variables () {
        return { query: this.search_query }
      }
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

    .envelope {
      overflow: hidden;
    }

    .filters {
      display: flex;
      flex-flow: row wrap;

      .toggle-input {
        margin-bottom: 15px;
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
