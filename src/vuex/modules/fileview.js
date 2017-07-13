const state = {
    path:'',
    deletePath: '',
    filelist: [],
    downfiles:{},
    downlinks:{},
    downfilesM4s:{}
}

const getters = {
    path: state => state.path,
    deletePath: state => state.deletePath,
    filelist: state => state.filelist,
    downfiles: state => state.downfiles,
    downfilesM4s: state => state.downfilesM4s,
    downlinks: state => state.downlinks,
}

const mutations = {
    filelist(state,msg){
        state.filelist = msg.list;
    },
    changepath(state,msg){
        state.path = msg.path;
    },
    deletefile(state,msg){
        state.deletePath = msg.deletePath;
    },
    downfiles(state,msg){
        if(msg.mode==='m4s'){
            state.downfilesM4s = msg.files;
        }else{
            state.downfiles = msg.files;
        }
    },
    showdownlinks(state,msg){
        state.downlinks = msg.links;
    },
}

const actions = {
    filelist ({commit, state, rootState},list) {
        commit('filelist',{'list':list});
    },
    changepath ({commit, state, rootState},path) {
        commit('changepath',{'path':path});
    },
    deletefile({commit, state, rootState},path) {
        commit('deletefile',{'deletePath':path});
    },
    downfiles({commit, state, rootState},files) {
        commit('downfiles',{'files':files});
    },
    downfilesM4s({commit, state, rootState},files){
        commit('downfiles',{'files':files,'mode':'m4s'});
    },
    showdownlinks({commit, state, rootState},links) {
        commit('showdownlinks',{'links':links});
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}