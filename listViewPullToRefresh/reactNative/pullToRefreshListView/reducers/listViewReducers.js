import * as types from '../actions/actionTypes';

const initialState = {
    feedSource:[],
    isRefreshing:true,
    loadingMore:false,
    hasMore:false,
    isLoading:true,
    isMore:false,
    error:'',
};

export function listViewReducers(state = initialState, action = {}) {

     console.log('listViewReducers '+JSON.stringify(action.type));

      switch(action.type){
        //列表刷新
        case types.LISTVIEW_REFRESH:{
        //    console.log('consoleconsole eeeee: '+JSON.stringify(action));

            return {
                feedSource:action.dataSource,
                isRefreshing:false,
                loadingMore: false,
                isLoading:false,
                isMore:false,
                 hasMore:true,
            }
        }

        case types.LISTVIEW_MORE:{ 

          console.log('loadMore'+JSON.stringify(state)+' : '+action.dataSource);

            return {
                feedSource:state.feedSource.concat(action.dataSource),
                isRefreshing:false,
                loadingMore: false,
                isLoading:false,
                isMore:false,
                hasMore:true,
            }
        }

         case types.LISTVIEW_FAILURE:{

            let feedSource = [];
            if(state.feedSource != undefined){
                feedSource =  state.feedSource;
            }  
          
            return{
                ...state,
                isLoading:false,
                isMore:false,
                isRefreshing:false,
               
            }
        }

        case types.LISTVIEW_SWITCH_LOADING:{
            return {
                ...state,
                isMore:true,
                isLoading:true,
            }
        }  
        
        default:   
            return state;
    }
}