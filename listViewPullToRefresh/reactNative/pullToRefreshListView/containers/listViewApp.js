'use strict';
import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import PullToRefreshListView from '../components/pullToRefreshListView';
import * as ListViewActions from '../actions/listViewActions';
import {connect} from 'react-redux';

class ListViewApp extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const{state,actions} = this.props;
        return(
            <PullToRefreshListView
                {...this.props} />
        );
    }
}

export default connect( 
    state =>({state:state.listViewReducers}),
    (dispatch) =>({actions: bindActionCreators(ListViewActions, dispatch)})
)(ListViewApp);