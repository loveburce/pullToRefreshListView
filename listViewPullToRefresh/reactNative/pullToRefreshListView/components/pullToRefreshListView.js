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
    AppState,
    RefreshControl,
    Dimensions,
    ProgressBarAndroid,
    ActivityIndicatorIOS,
    DeviceEventEmitter,
} from 'react-native';
var {width, height} = Dimensions.get('window');

import LoadStatusView from './loadStatusView';
import ItemView from './itemView';
import * as types from '../actions/actionTypes';
// import {StaffFeedType} from '../common/constant';

// import {getFeedItemType} from '../utils';


var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class FeedListView extends React.Component{

    constructor(props){
        super(props);
        this.state = {//设置初值
            currentAlpha: 1.0,//标志位，记录当前value
            fadeAnim: new Animated.Value(0),
            fadeInOpacity: new Animated.Value(1), // 初始值,

        };
    }



    componentWillUnmount() {
    }

    componentWillMount(){
        console.log('consoleconsole 2222: ');
        this.props.actions.switchLoading();

        this.props.actions.fetchFeedList(types.LISTVIEW_REFRESH);
       this._onRefresh();
    }


    _renderRow(row){  
        console.log('TouchableOpacity 000 '+JSON.stringify(row));
      
        return(   
            // <View style={{height:200,}}><Text>hhhhhheheheheheheheh</Text></View>
            <ItemView row={row}/>
        )
    }


    render(){
        let {state,actions} = this.props;
        let {feedSource,isLoading,isRefreshing,loadingMore,isMore,hasMore} = state;

        if(feedSource == null  || feedSource.length==0){
            return (<LoadStatusView isLoading = {isLoading} />);
        }

       return(
           <View style={styles.container}>  
                <ListView
                    style ={{flex:1,marginBottom:25,marginTop:25}}   
                    dataSource={ds.cloneWithRows(feedSource)} 
                    renderRow={this._renderRow.bind(this)}
                    enableEmptySections = {true} 
                    automaticallyAdjustContentInsets={false}
                    initialListSize={5}
                    onEndReached={()=>{this._onLoadMore()}}
                    renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator}/>}
                    renderFooter={hasMore ? this._footerView : null}
                    onEndReachedThreshold={10}
                    contentContainerStyle={{backgroundColor: 'white'}}
                    refreshControl={
                        <RefreshControl 
                            stlye = {{ flex:1,flexDirection:'column',justifyContent: 'center',alignItems: 'center'}}
                            refreshing={isRefreshing}
                            onRefresh={this._onRefresh.bind(this)}
                            tintColor="#A8A8A8"
                            title={'loading'}
                            progressBackgroundColor="white"
                            colors = {['#59aeef']}/>
                    }
                />
           </View>
       )
    }

 
    /**
     * 下拉刷新
    */
   _onRefresh(){
        console.log('下拉刷新 : ');
       let {state,actions} = this.props;
    //    console.log('fetchFeedList : '+JSON.stringify(this.props));
       let {isLoading} = state;
       let {fetchFeedList,switchLoading} = actions;
       if(isLoading){
           return;
       }else{
            switchLoading();
            setTimeout(()=>{
                fetchFeedList(types.LISTVIEW_REFRESH);
            },10)
       }
   }
    /**
    * 加载更多
   */
   _onLoadMore(){
       console.log('加载更多 : ');
        let {state,actions} = this.props;
        let {isLoading} = state;
        let {fetchFeedList,switchLoading} =this.props.actions;
       if(isLoading){
          return;
       }else{
            switchLoading();
            //延迟1秒再请求数据
            setTimeout(()=>{      
                fetchFeedList(types.LISTVIEW_MORE);
            },50)
       }
       
   }
  
   _footerView(){
        if(Platform.OS === 'android'){
            return(
                <View style={styles.footerContainer}>
                    <ProgressBarAndroid styleAttr='Small'/>
                    <Text>{'loading'}</Text>
                </View>
            );
        }else{
            return(
                <View style={styles.footerContainer}>
                <ActivityIndicatorIOS
                    animating={true}
                    size="small"/>
                    <Text>{'loading'}</Text>
                </View>
            ); 
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
        backgroundColor: '#fff3ba', 
        position: 'absolute',
        top: 0,
    },
    updateCountText: {
        fontSize: 14,
        color:'#F2BA33',
        textAlign:'center',
    }
});