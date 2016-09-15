import React,{Component} from 'react';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import * as counterReducers from '../reducers/counter';
import CounterApp from './counterApp';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(counterReducers);
const store = createStoreWithMiddleware(reducer);

export default class App extends Component{
    render(){
        return(
            <Provider store={store}>
                <CounterApp />
            </Provider>
        );
    }
}