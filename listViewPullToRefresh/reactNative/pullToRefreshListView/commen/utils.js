
import {JsonResult} from './constant';


import moment from 'moment';

 
export function getFormattingTime(timeStr){
    // let timehah = moment(parseInt(timeStr)).format('HH:mm');

    let date = new Date(timeStr);
    let dateCurrent = new Date();
    let yearCurrent = dateCurrent.getFullYear();
    let yearTag = date.getFullYear();
    let monthCurrent = dateCurrent.getMonth()+1;
    let monthTag = date.getMonth()+1;
    let dayCurrent = dateCurrent.getDate();
    let dayTag = date.getDate();

    let hours = date.getHours();
    let minutes = date.getMinutes();

    // console.log('if(monthTag<10) : '+dayTag+' : '+(dayTag<10));
    let monthFormat = '';
    if(monthTag<10){
        monthFormat = '0'+monthTag
    }else{
         monthFormat = monthTag
    }
    let dayFormat = '';
    if(dayTag<10){
        dayFormat = '0'+dayTag;
    }else{
        dayFormat = dayTag;
    }
    if(hours<10){
        hours = '0'+hours
    }
    if(minutes<10){
        minutes = '0'+minutes;
    }

    if(yearCurrent === yearTag && monthCurrent === monthTag && dayCurrent === dayTag){
        return hours+' : '+minutes;
    }else if(yearCurrent === yearTag && monthCurrent === monthTag && (dayCurrent-1 === dayTag)){
        return 'yesterday'+' '+hours+' : '+minutes;
    }else if(yearCurrent === yearTag && monthCurrent === monthTag){
        return (monthFormat + "-" + dayFormat +' '+ hours+' : '+minutes);
    }else if(yearCurrent === yearTag){
        return (monthFormat + "-" + dayFormat);
    }else {
        return date.getFullYear() + "-" + (monthFormat + "-" + dayFormat);
    }
    

    // if(yearCurrent === yearTag && monthCurrent === monthTag && dayCurrent === dayTag){
    //     return timehah;
    // }else if(yearCurrent === yearTag && monthCurrent === monthTag && dayCurrent === dayTag-1){
    //     console.log('getLocalString() : '+getLocalString('yesterday')+' : '+timehah);
    //     return getLocalString('yesterday')+timehah;
    // }else if(yearCurrent === yearTag && monthCurrent === monthTag){
    //     return (date.getMonth()+1 + "-" + date.getDate() +' '+ timehah);
    // }else if(yearCurrent === yearTag){
    //     return (date.getMonth()+1) + "-" + date.getDate();
    // }else {
    //     return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    // }
}

export function getFormatFileSize(fileSize){
    let fileSizeStr = '';
    let transformstr = 0;
    if(fileSize < 1024){
        fileSizeStr = fileSize+'B';
    }else if(fileSize < 1048576){
        transformstr = fileSize/1024;
        fileSizeStr = transformstr.toFixed(2)+'K';
    }else if(fileSize < 1073741824){
        transformstr = fileSize/1048576;
        fileSizeStr = transformstr.toFixed(2)+'M';
    }else {
        transformstr = fileSize/1073741824;
        fileSizeStr = transformstr.toFixed(2)+'G';
    }
    return fileSizeStr;
}

export function networkRequests(url,successCallback, failCallback){
        fetch(url)
        .then((response) => response.text())
        .then((responseText) =>{
            successCallback(JSON.parse(responseText));
        })
        .catch(function(err){
            failCallback(err);
        });
    }


