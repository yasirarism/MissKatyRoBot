/* ------------------------------------------------------------------------
*
* ID: 1kgHU4OQQwm1Chcr7JbKTZHcjxZMj3bOg0Z9Fwg4UnQ7mZfxEHDyLxXe6
*
* Author
* By: Adipati
* Telegram: @crossxy
*
* Selasa, 18 Agustus 2020 21:29
*
* ------------------------------------------------------------------------ */

function doGet(e) {
  var text = e.parameter.text;
  if(!text)return HtmlService.createHtmlOutput('{"error":"true","exception":"text tidak ada"}')
  var response = getSSResponse(text);
  return HtmlService.createHtmlOutput(response);
}

function getSSResponse(text){
  var options = {
     "method" : "GET",
     "muteHttpExceptions" : true,
     "headers" : {
       "cookie" : "i18n_redirected=id; _ga=GA1.2.1562468568.1595159115; languageCode=id; _gid=GA1.2.921437503.1597757264; dotcom_session_key=s%3ADEKWu8wcteRODcHZYgTf3gN4TMT3Rw0G.L5zw4emPTjwA5kAU1RxauMaSGNE9SEpyE2VH3%2FmgMy4; normalProb=0; currentChatCnt=NaN; bubbleCount=92; _gat=1"
     }
   };
  var response = UrlFetchApp.fetch("https://www.simsimi.com/api/chats?lc=id&ft=0&normalProb=0&reqText="+text, options);
  var hasil = JSON.parse(response);
  if(hasil.count<=20){
    var addCount = addSSCount();
    if(!addCount) return '{"error":"true","exception":"Add Count tidak berhasil"}';
  }
  hasil.response = hasil.respSentence;
  delete hasil["count"];
  delete hasil["respSentence"];
  return hasil["response"];
  //Logger.log(hasil.response);
}

function addSSCount(){
  var options = {
     "method" : "GET",
     "muteHttpExceptions" : true,
     "headers" : {
       "cookie" : "i18n_redirected=id; _ga=GA1.2.1562468568.1595159115; languageCode=id; _gid=GA1.2.921437503.1597757264; dotcom_session_key=s%3ADEKWu8wcteRODcHZYgTf3gN4TMT3Rw0G.L5zw4emPTjwA5kAU1RxauMaSGNE9SEpyE2VH3%2FmgMy4; normalProb=0; currentChatCnt=NaN; bubbleCount=92; _gat=1"
     }
   };
  var response = UrlFetchApp.fetch("https://www.simsimi.com/api/missA?mid=1&pid=10&upid=73972277&checked=%5B%22510073553%22%2C%22510073557%22%5D", options);
  var hasil = JSON.parse(response);
  
  if(hasil.reward==20)return true;
  else return false;
}

//Simsimi Api Afara
function chatBot(txt) {
  var response = UrlFetchApp.fetch("https://afara.my.id/api/sim-simi?text="+txt);
  response =  JSON.parse(response);
  var hasil = response.response
  return hasil;
  //Logger.log(hasil)
}
