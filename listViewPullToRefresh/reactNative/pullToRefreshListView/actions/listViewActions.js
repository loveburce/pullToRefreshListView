import * as types from './actionTypes';
import * as Utils from '../commen/utils';
import * as constant from '../commen/constant';

function getUrlPart(start,prePageLastId = 0) {
     if(prePageLastId == 0){
         return {size:constant.HostUrl.size_value,start:start}
     }else{
         return {size:constant.HostUrl.size_value,start:start,prePageLastId:prePageLastId}
     }
}

export function switchLoading(){
    return {type:types.LISTVIEW_SWITCH_LOADING};
}

export function fetchFeedList(fetchType){
    

    let musicName = 'only love';
    let musicUrl = constant.HostUrl.music_search + '?count=10&q=' + musicName;

    return  async function(dispatch) {
        Utils.networkRequests(musicUrl, function(result){
            console.log('consoleconsole 1111: result '+JSON.stringify(result));
            if(result != undefined){
                if(fetchType == types.LISTVIEW_MORE){ 
                    dispatch(loadMoreList(result.musics));
                }else{
                    dispatch(refreshList(result.musics));
                }     
            }else{
                dispatch(NotFoundError());
            }
        }, function(err){
           dispatch(NotFoundError());   
        });       
    }
}

//下拉刷新请求数据后刷新列表
  function refreshList(dataList) {
    //  console.log('refreshList'+JSON.stringify(dataList));
      return {
        type: types.LISTVIEW_REFRESH,
        dataSource:dataList,
     }
 }

 //上拉加载请求数据后刷新列表
 function loadMoreList(dataList) {
    console.log('loadMore');
    return {
        type: types.LISTVIEW_MORE,
        dataSource:dataList,
    };
};

// 下拉加载数据时请求错误 调用方法 
 function NotFoundError() {
    return{
        type: types.LISTVIEW_FAILURE,
        dataSource:null,
        isLoading:false,
    }
};
