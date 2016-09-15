import React,{Component} from 'react';
import ReactNative,{
    View,
    Text,
    Image,
    Animated,
    Platform,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    DeviceEventEmitter
} from 'react-native';


export default class RowViewCelebrate extends React.Component{   
    // 构造函数  
    constructor(props) {  
        super(props);   
   }  


    render(){
        let row = this.props.row;
        console.log('TouchableOpacity 000 '+JSON.stringify(this.props.row));
      
        return(
            <TouchableOpacity style={[styles.row, styles.item]} {...this.props}>
                <View style={[styles.center]}>
                    <Image source={{uri: row.image}} style={styles.book_img}/>
                </View>
                <View style={styles.content}>
                    <View>
                        <Text style={{flex:1}} numberOfLines={1}>{row.title}</Text>
                    </View>
                    <View style={{marginTop:10}}>
                        <Text style={[styles.publisher, {flex:1}]} numberOfLines={1}>{row.attrs.publisher}</Text>
                    </View>
                    <View style={{marginTop:10}}>
                        <Text style={[styles.publisher, {flex:1}]} numberOfLines={1}>{row.author.name}</Text>
                    </View>
                    <View style={[styles.row,{marginTop:10,flex:1}]}>
                        <Text style={styles.price}>{row.attrs.singer}</Text>
                        <Text style={styles.pages}>{row.attrs.pubdate}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
  row:{
    flexDirection:'row'
  },
  item:{
    height:120,
    borderTopWidth:1,
    borderBottomWidth:1,
    marginTop:5,
    marginBottom:5,
    borderColor:'#ccc'
  },
  book_img:{
    width:80,
    height:100,
    resizeMode:Image.resizeMode.contain
  },
  center:{
    justifyContent:'center',
    alignItems:'center'
  },
  content:{
    flex:1,
    marginTop:10,
    marginLeft:10,
    marginRight:10,
  },
  publisher:{
    color:'#A3A3A3',
    fontSize:13
  },
  price:{
    color:'#2BB2A3',
    fontSize:16
  },
  pages:{
    marginLeft:10,
    color:'#A7A0A0'
  }
});
