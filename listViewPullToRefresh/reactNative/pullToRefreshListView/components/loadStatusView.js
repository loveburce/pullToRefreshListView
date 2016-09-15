import React,{Component, PropTypes} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ProgressBar,
    Platform,
    ProgressBarAndroid,
    ActivityIndicatorIOS,
    TouchableOpacity
} from 'react-native';

// const LOAD_STATE_ING = 'loading';
// const LOAD_STATE_ERROR = 'error';
// import getLocalString from '../../../core/localString';
// import LoadingView from './loadingView';

export default class LoadStatusView extends Component{
    constructor(props){
        super(props);
    }

   
  
    render(){
        let contentView;

        if(this.props.isLoading){
	        // contentView = this._renderLoadingView();
             contentView = this._getSpinner();
        }else{
	        // contentView = this._renderErrorView();
            contentView = this._renderEmptyView();
        }
        return(
            <View style = {{flex:1}}>
                {
                 contentView
                }
            </View>
        );
    }

     _getSpinner() {   
        if (Platform.OS === 'android') {
                return (
                    <View style = {{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                        <ProgressBarAndroid 
                            style={{height: 40, width:40}}
                            styleAttr="Inverse"
                        />
                        <Text>{'loading'}</Text>
                    </View>
                );
            } else{
                return ( <View style = {{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <ActivityIndicatorIOS
                                animating={true}
                                size="small"
                                style={{height: 40, width:40}}
                            />
                            <Text>{'loading'}</Text>
                        </View>
                    );      
            }
    }

    _renderEmptyView(){
        return(
        // <View>
        //     {this._getSpinner()}
        // </View>
       
            <View style={styles.commonChildContainer}>
              
                    <Image style={styles.noDataImage}  source={require('../images/no_datas.png')}/>
                    <Text style={styles.tipsText}>
                        {'emptyDataTipOne'}
                    </Text>
                <TouchableOpacity onPress = {()=>{this.props.createFeed()}}>
                    <Text style={styles.createNewFeed}>
                        {'emptyDataCreateFeed'}
                    </Text>
                 </TouchableOpacity>
            </View>
        
        );
    }

    _renderErrorView(){
        return(
            <View style={styles.commonChildContainer}>
                <Text style={styles.errorTipsText}>
                {'loadFail'}
                </Text>
                <TouchableHighlight underlayColor={'rgba(0,0,0,0)'} onPress={this.props.onRetry}>
	                <View style={[styles.ovalButton, this.props.bgStyle]}>
	      	            <Text style={[styles.ovalText, this.props.bgStyle]}>{'retry'}</Text>
	                </View>
                </TouchableHighlight>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#909090'
    },
    commonChildContainer:{
        flex:1,
        backgroundColor:'#F5F5F7',
        alignItems:'center',
        justifyContent:'center'
    },
    noDataImage:{
        justifyContent:'center',
        alignItems:'center',
        resizeMode:Image.resizeMode.contain,
        width:90,
        height:90
    },
    tipsText:{
        color:'#bdc6cc',
        fontSize:14,
        marginTop:10
    },
    createNewFeed:{
        color:'#59aeef',
        fontSize:15,
        marginTop:10
    },
    errorTipsText:{
        color:'#59aeef',
        fontSize:18,
        marginBottom:20,
        
    },
    ovalButton:{
        paddingTop:5,
        marginBottom:5,
        paddingLeft:30,
        paddingRight:30,
        borderColor:'#cccccc',
        borderStyle:'solid',
        borderWidth:1,
        borderRadius:15,
        alignItems:'center',
        justifyContent:'center'
    },
    ovalText:{
        color:'#cccccc',
        fontSize:15,
    }
})