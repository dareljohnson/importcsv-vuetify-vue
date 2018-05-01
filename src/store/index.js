import Vue from 'vue'
import Vuex from 'vuex'

import shared from './shared/index'

Vue.use(Vuex)

export const store = new Vuex.Store({
    modules: {
        shared: shared
    }
})