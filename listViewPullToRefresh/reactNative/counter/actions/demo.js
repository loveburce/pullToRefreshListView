import React,{Component} from 'react';
import {
    StyleSheet, 
    View, 
    Text, 
    Image, 
    ListView,
    Platform,
    Animated,
    Easing,
    RefreshControl,
    Dimensions,
    ProgressBarAndroid,
    ActivityIndicatorIOS,
    DeviceEventEmitter,
        } from 'react-native';
var {width, height} = Dimensions.get('window');
import RowViewComplex from './rowViewComplex';
import RowViewSimple from './rowViewSimple';
import RowViewCelebrate from './rowViewCelebrate';
import RowViewRecord from './rowViewRecord';
import LoadStatusView from './loadStatusView';
import * as types from '../actions/actionTypes';
import {StaffFeedType} from '../common/constant';
import XSYSendingFeedModule from '../../../native/NativeSendingFeedModule';//原生注册模块
import XSYFeedCommentInputModule from '../../../native/staffFeed/NativeFeedCommentInputModule';// 评论和评论框消失
import getLocalString from '../../../core/localString';
import XSYNetWorkTool from '../../../core/XSYNetWorkTool/XSYNetWorkTool';
import {getFeedItemType} from '../utils';

import InputModalView from '../itemView/childInputModalView';


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class FeedListView extends React.Component{

    _feedUpdateContent(json){
        this._onRefresh();
    };

    constructor(props){
        super(props);
        this.state = {//设置初值
            currentAlpha: 1.0,//标志位，记录当前value
            fadeAnim: new Animated.Value(0),
            fadeInOpacity: new Animated.Value(1), // 初始值,

            openPopover : false,
        };
    }

    componentWillUnmount() {
        XSYNetWorkTool.removeEventListener(XSYNetWorkTool.TAG_NETWORK_CHANGE,this.handleMethod);
        DeviceEventEmitter.removeAllListeners('feedUpdateContent');
    }

    componentWillMount(){
        if(Platform.OS === 'ios'){
             XSYSendingFeedModule.initSendFeedListener();
        }
        DeviceEventEmitter.addListener('feedUpdateContent', this._feedUpdateContent.bind(this)); 
        DeviceEventEmitter.addListener('feedLoadData',(value)=>{  
          this.props.actions.switchLoading(this.props.state.currentId);
          this.props.actions.fetchFeedList(0,types.XSY_STAFFFEED_REFRESH,this.props.state.currentId);
          DeviceEventEmitter.removeAllListeners('feedLoadData');
       }); 

       XSYNetWorkTool.addEventListener(XSYNetWorkTool.TAG_NETWORK_CHANGE,this.handleMethod.bind(this));
       
       this._initUserInfo();        
    }

    createFeed(){
      alert('创建动态');
    }

    handleMethod(isConnected){
       if(isConnected){
            this._onRefresh();
       }
    }

    _renderRow(row){  
      
        let {instances,currentId} = this.props.state;
        let {userName,userId,closePopover} = instances[currentId];
        let itemType = row.type;
        let systemType = row.system;
        let hasFeed = (row.feed !== undefined) ? true : false;
        let listType = (row.listType === 1)? true:false;
        let canDelete = this.canDelete(row.user.uid, systemType);
        let canFavorite = this.canFavoured(row.system, row.type, row.item);
        let feedOperation = {
            canDelete:canDelete,
            canFavorite:canFavorite,
        }
         let userInfo = {
            name:userName,
            uid:userId,
            prefix:userName,
        }


        switch (getFeedItemType(itemType,systemType,hasFeed,listType)) {

            case 3: //普通活动记录
            case 9:{//转发

                // console.log('combinationComment 222222222: '+JSON.stringify(row));
                return (
                    <RowViewComplex row={row} currentId={this.props.state.currentId}  actions={this.props.actions} feedOperation={feedOperation} userInfo={userInfo} /> 
                );
            }   
            case 4: {//喜报
                return ( 
                    <RowViewCelebrate row={row} currentId={this.props.state.currentId} actions={this.props.actions} feedOperation={feedOperation} userInfo={userInfo} /> 
                )
            }
            case 6:{//活动流
                return (      
                   <RowViewSimple row={row} currentId={this.props.state.currentId} actions={this.props.actions} feedOperation={feedOperation} userInfo={userInfo} /> 
                )
            }
             case 5:{//活动记录
                 return(   
                    <RowViewRecord row={row} currentId={this.props.state.currentId} actions={this.props.actions}  feedOperation={feedOperation} userInfo={userInfo} /> 
                 )
             }
            default:
                return null;
        }
    }
   
    hideInputKeyPanel (ifShow){
           //alert('ifShow'+ifShow);
     if(!ifShow){
         this.props.actions.closeCommentInput(this.props.state.currentId);
     }
   }

    render(){
        console.log('this.props : '+JSON.stringify(state));
        let {state,actions} = this.props;
        let {instances,currentId} = state;
        let {feedSource,isLoading,isRefreshing,hasMore,feedStart,updateCount,openInteractive,data,row,commentUser,closePopover} = instances[currentId];
        let {userName,userId} = instances[currentId];
        let userInfo = {
            userName:userName,
            userId:userId,
        }

        // console.log('combinationComment 00000 currentId: '+currentId+' - '+JSON.stringify(state));
     
        let showUpdateWeight = false;
        if(updateCount > 0){
            showUpdateWeight = true;
            this.startAnimation();
        }
        if(feedSource == null  || feedSource.length==0){
            console.log('INITIALIZE');
            return (<LoadStatusView isLoading = {isLoading} createFeed = {this.createFeed.bind(this)} />);
        }

        console.log('openInteractive 0: '+(openInteractive != undefined && row != undefined));
       
        // if(openInteractive != undefined && row != undefined){
        //      console.log('openInteractive 0: '+openInteractive+' : '+(openInteractive == true));
        //     if(openInteractive == true){
        //         this.state.modalVisible = true;
        //     }else{
        //         this.state.modalVisible = false;
        //     } 
        // }

        let commentUserInfo = '';
        openInteractive = openInteractive == undefined ? false : openInteractive;
        if(commentUser != undefined && commentUser != ''){
            commentUserInfo = ' @'+commentUser.name;
        }
        console.log('modalVisible : '+commentUserInfo);

       return(
         
           <View style={styles.container}>
                {
                    showUpdateWeight?
                        <Animated.View style={[styles.updateCountBack, { opacity: this.state.fadeInOpacity,}, ]}>
                            <Text style={styles.updateCountText}>{getLocalString('updateFeedCount').replace('{0}',updateCount)}</Text>   
                        </Animated.View>:null
                }
                <ListView
                    style ={{flex:1}}   
                    dataSource={ds.cloneWithRows(feedSource)} 
                    renderRow={this._renderRow.bind(this)}
                    enableEmptySections = {true} 
                    automaticallyAdjustContentInsets={false}
                    initialListSize={5}
                    onEndReached={()=>{this._onLoadMore()}}
                    renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator}/>}
                    renderFooter={hasMore ? this._footerView : null}
                    onEndReachedThreshold={10}
                    onScroll={this._listViewScroll.bind(this)}
                    contentContainerStyle={{backgroundColor: 'white'}}
                    refreshControl={
                        <RefreshControl 
                            stlye = {{ flex:1,flexDirection:'column',justifyContent: 'center',alignItems: 'center'}}
                            refreshing={isLoading}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#A8A8A8"
                            title={getLocalString('loading')}
                            progressBackgroundColor="white"
                            colors = {['#59aeef']}/>
                    }
                />

             <InputModalView row ={row} userInfo={userInfo}  modalVisible={openInteractive} hideInputKeyPanel={this.hideInputKeyPanel.bind(this)} actions={this.props.actions} currentId={this.props.state.currentId} commentUser={commentUserInfo}/>
              
           </View>
       )
    }


    closeInputModalView(){
         console.log('showPopover() : 1111');
        // this.state.openInteractive = false;
        this.setState({openPopover:false});
    }

    startAnimation(){
        console.log('row  instances[currentId] 跟新提示 startAnimation: ');
        Animated.timing(this.state.fadeInOpacity, {
            toValue: 0, // 目标值
            duration: 4000, // 动画时间
            easing: Easing.linear // 缓动函数
        }).start();
    }

    _listViewScroll(){
        // this.props.actions.closePopover(this.props.state.currentId);
    }

    /**
     * 下拉刷新
    */
   _onRefresh(){
       let {state,actions} = this.props;
       let {isLoading,feedStart,prePageLastId} = state.instances[state.currentId];
       let {fetchFeedList,switchLoading} = actions;
       if(isLoading){
           return;
       }else{
            switchLoading(state.currentId);
            setTimeout(()=>{
                fetchFeedList(0,types.XSY_STAFFFEED_REFRESH,state.currentId);
            },10)
       }
   }
    /**
    * 加载更多
   */
   _onLoadMore(){
       let {state,actions} = this.props;
       let {isLoading,prePageLastId,feedStart} = state.instances[state.currentId];
       let {fetchFeedList,switchLoading} =this.props.actions;

        console.log(' JSON :  feedOperation :00 '+isLoading);
       if(isLoading){
          return;
       }else{
            switchLoading(state.currentId);
            //延迟1秒再请求数据
            setTimeout(()=>{      

                  console.log(' JSON :  feedOperation :11 feedStart '+feedStart);
                fetchFeedList(feedStart,types.XSY_STAFFFEED_MORE,state.currentId,prePageLastId);

                 console.log(' JSON :  feedOperation :11 '+feedStart+' : '+types.XSY_STAFFFEED_MORE+' : '+state.currentId+' : '+prePageLastId);
            },50)
       }
       
   }

   _initUserInfo(){
       this.props.actions.initUserInfo(this.props.state.currentId)
   }
  
   _footerView(){
        if(Platform.OS === 'android'){
            return(
                <View style={styles.footerContainer}>
                    <ProgressBarAndroid styleAttr='Small'/>
                    <Text>{getLocalString('loading')}</Text>
                </View>
            );
        }else{
            return(
                <View style={styles.footerContainer}>
                <ActivityIndicatorIOS
                    animating={true}
                    size="small"/>
                    <Text>{getLocalString('loading')}</Text>
                </View>
            ); 
        }   
   }

   canDelete(feedUid,feedType){
        let {state,actions} = this.props;
        let {instances,currentId} = state;
        let {userId} = instances[currentId]
        return (feedUid == userId);
   }

   canFavoured(feedSystem,feedType,feedItem){
        return (feedSystem == StaffFeedType.AppsMessageId || feedSystem == StaffFeedType.AppsSignInId ||
                feedSystem == StaffFeedType.AppsFileId || feedSystem == StaffFeedType.AppsBlogId || feedSystem == StaffFeedType.AppsPraiseId || feedSystem == StaffFeedType.AppsQuestionId)
                && feedType == 0 && (feedItem != StaffFeedType.ActivityRecord && feedItem != StaffFeedType.AppsActivityNewId);
   } 

   getIsFeed(feedItem){
       let array = [];
       if(feedItem.atList != undefined){
           array = feedItem.atList ;
       }
       let isFeed = true;
       if(array == undefined || array.length == 0){
           if(feedItem.records != undefined){
               array = feedItem.records;
           }
           isFeed = false;
       }
        if(array == undefined || array.length == 0){
           if(feedItem.activityRecords != undefined){
               array = feedItem.activityRecords;
           }
           isFeed = false;
       }
        if(array == undefined || array.length == 0){
           if(feedItem.feeds != undefined){
               array = feedItem.feeds;
           }
           isFeed = false;
       }
   } 
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff'
        
    },
    footerContainer:{
        // backgroundColor:'#ff00ff',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:20,
        paddingBottom:20,
    },
    separator:{
        height:0.5,
        backgroundColor:'#bdc6cc'
    },
   content: {
        justifyContent: 'center',
        backgroundColor: 'yellow',
    },
    updateCountBack: {
        width:width,
        height:35,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF3BA',
        position: 'absolute',
        top: 0,
    },
    updateCountText: {
        fontSize: 14,
        color:'#F2BA33',
        textAlign:'center',
    }
});