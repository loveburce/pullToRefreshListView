import React,{Component} from 'react';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import * as listViewReducers from '../reducers/listViewReducers';
import ListViewApp from './listViewApp';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(listViewReducers);
const store = createStoreWithMiddleware(reducer);

export default class App extends Component{
    render(){
        return(
            <Provider store={store}>
                <ListViewApp />
            </Provider>
        );
    }
}