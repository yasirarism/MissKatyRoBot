//fungsi mengirim foto untuk bot dengan request ke api telegram
function sendPhoto(chat_id, blob, parse = 'HTML') {
  var token = "BOT_TOKEN";
  var payload = {
    'method':'sendPhoto',
    'chat_id':String(chat_id),
    'photo':blob,
    'caption':'Created with @MissKatyRoBot',
    
  }
  var data = {
    'method':'post',
    'payload':payload
  }
  return UrlFetchApp.fetch("https://api.telegram.org/bot" + token + "/", data);
}

//fungsi membuat quotes dengan api google page speed test yang diambil screenshot webnya
function buatQuotes(text, by) {
  if (text){
  
    //menggunakan versi web google app script(ada warning header)
    //var url = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=" + url_hasil_deploy + "?" + encodeURIComponent(text);
    
    //menggunakan static site github(tanpa warning header)
    var url = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&url=https://aghisna12.github.io/belajar/QuotesGenerator.html?" + encodeURIComponent(text);
    if (by) {
      url += "::" + by;
    }
    var respons = UrlFetchApp.fetch(url);
    var respons_r = JSON.parse(respons);
    if (respons_r.lighthouseResult.audits["final-screenshot"].details.data) {
      var str_img = respons_r.lighthouseResult.audits["final-screenshot"].details.data;
      var base64_img = str_img.replace("data:image/jpeg;base64,", "")
      var decoded = Utilities.base64Decode(base64_img);
      return Utilities.newBlob(decoded, MimeType.JPEG, "test.jpeg");
    }
  }
}
