function userDB(msg) {
  var iduser = msg.from.id
  var username = msg.from.username
  var nama = msg.from.first_name
  let range = db.has(iduser) // buat cek user ID udah ada belum
  if(!range){ //jika belum ada maka kita tambahin
  let row = db.sheet.getLastRow() + 1 // kita ambil baris terakhir
  let f = db.setValue('A'+row, iduser)
  let g = db.setValue('B'+row, nama)
  let h = db.setValue('C'+row, username)
  }
  return
}

function penggunaBot() {
  var hasil = db.getAll()
  var jumlah = hasil.length-1
  return jumlah
}

function debugPesan(update){
  var text = update.message.reply_to_message
  var document = tg.util.textBlob(tg.util.outToJSON(text), update.update_id)
  if(text.text){
    var tipe = 'Teks'
  }else if(text.photo){
    var tipe = 'Photo'
  }else if(text.sticker){
    var tipe = 'Sticker'
  }else if(text.video){
    var tipe = 'Video'
  }else if(text.audio){
    var tipe = 'Audio'
  }else if(text.document){
    var tipe = 'Document'
  }else if(text.voice){
    var tipe = 'Voice'
  }else if(text.dice){
    var tipe = 'Dice'
  }else if(text.game){
    var tipe = 'Game'
  }else if(text.poll){
    var tipe = 'Poll'
  }else if(text.video_note){
    var tipe = 'Video Note'
  }else if(text.location){
    var tipe = 'Lokasi'
  }else var tipe = 'Belum DiKetahui'
  var isi =
  `
DebugPesan......
    └Dari <code>${update.message.from.id}</code> (@${update.message.from.username})
Pesan yang direply :
   └Dari <code>${text.from.id}</code> (@${text.from.username})
      └✉️Pesan bertipe ${tipe}
     
<b>🤖Lebih jelasnya ada difile TXT</b>
  `
  var data ={
    'chat_id' : String(update.message.chat.id),
    'document': document,
    'caption': isi,
    'parse_mode': 'HTML',
    'reply_to_message_id': update.message.message_id,
  }
  return tg.requestForm('sendDocument', data)
}

// Save data user
function saveUser(userID){
 let range = db.has(userID) // kita cek apakah id user ada atau tidak.
 if(!range){ //jika belum ada maka kita tambahin
  let row = db.sheet.getLastRow() + 1 // kita ambil baris terakhir
  let f = db.setValue('A'+row,userID) // 'A'+row disini diartikan sebagai 'A2' baris ke 2 kolom pertama(A)
 }
 return
}

// bikin fungsi broadcast
function broadcast(text,entities){ //entities disini di butuhkan untuk memformat text jika pesannya mengandung text bold maka akan ke format otomatis. 
 let sender = 0 // jika bot sudah mengirim pesan ke 20 orang maka bot akan sleep untuk 2 detik.
 let success = 0 //pesan yang berhasil dikirim
 let failed = 0 //pesan yang gagal dikirim
 let data = db.getAll() // mengambil semua data user
 data.shift() // menghapus data pertama [id]
 let amount = data.length // banyak user
 bot.build.loop(amount,(i)=>{ // looping kirim pesan 
    let user = data[i][0]
    sender ++ // angka sender akan naik seiring loopiny
    if(sender >= 20){ // jika sender lebih dari 20 atau sama dengan 20
     sender = 0 //kita reset lagi hitungan sender nya
     Utilities.sleep(2000) // jeda 2 detik
     try{ //lanjut broadcast
       bot.sendMessage(user,text,{entities:entities})
       success ++ // berhasil ++
     }catch (error){
       failed ++ // gagal ++
     }
   }else{ // jika sender kurang dari 20
     try{ //broadcast pesan
      bot.sendMessage(user,text,{entities:entities})
      success ++ // berhasil ++
     }catch(error){
      failed ++ // gagal ++
    }
   }
 }) //jika broadcast sudah selesai maka di akhiri dengan mengirim pesan :
 return bot.replyToMessage("Berhasil mengirim ke "+success+" orang, Gagal mengirim ke "+failed+" orang")
}

// Fungsi Google Translate
// indek bahasa yang di support Google Translate
var languages = {
    'auto': 'Automatic',
    'af': 'Afrikaans',
    'sq': 'Albanian',
    'am': 'Amharic',
    'ar': 'Arabic',
    'hy': 'Armenian',
    'az': 'Azerbaijani',
    'eu': 'Basque',
    'be': 'Belarusian',
    'bn': 'Bengali',
    'bs': 'Bosnian',
    'bg': 'Bulgarian',
    'ca': 'Catalan',
    'ceb': 'Cebuano',
    'ny': 'Chichewa',
    'zh-cn': 'Chinese Simplified',
    'zh-tw': 'Chinese Traditional',
    'co': 'Corsican',
    'hr': 'Croatian',
    'cs': 'Czech',
    'da': 'Danish',
    'nl': 'Dutch',
    'en': 'English',
    'eo': 'Esperanto',
    'et': 'Estonian',
    'tl': 'Filipino',
    'fi': 'Finnish',
    'fr': 'French',
    'fy': 'Frisian',
    'gl': 'Galician',
    'ka': 'Georgian',
    'de': 'German',
    'el': 'Greek',
    'gu': 'Gujarati',
    'ht': 'Haitian Creole',
    'ha': 'Hausa',
    'haw': 'Hawaiian',
    'iw': 'Hebrew',
    'hi': 'Hindi',
    'hmn': 'Hmong',
    'hu': 'Hungarian',
    'is': 'Icelandic',
    'ig': 'Igbo',
    'id': 'Indonesian',
    'ga': 'Irish',
    'it': 'Italian',
    'ja': 'Japanese',
    'jw': 'Javanese',
    'kn': 'Kannada',
    'kk': 'Kazakh',
    'km': 'Khmer',
    'ko': 'Korean',
    'ku': 'Kurdish (Kurmanji)',
    'ky': 'Kyrgyz',
    'lo': 'Lao',
    'la': 'Latin',
    'lv': 'Latvian',
    'lt': 'Lithuanian',
    'lb': 'Luxembourgish',
    'mk': 'Macedonian',
    'mg': 'Malagasy',
    'ms': 'Malay',
    'ml': 'Malayalam',
    'mt': 'Maltese',
    'mi': 'Maori',
    'mr': 'Marathi',
    'mn': 'Mongolian',
    'my': 'Myanmar (Burmese)',
    'ne': 'Nepali',
    'no': 'Norwegian',
    'ps': 'Pashto',
    'fa': 'Persian',
    'pl': 'Polish',
    'pt': 'Portuguese',
    'pa': 'Punjabi',
    'ro': 'Romanian',
    'ru': 'Russian',
    'sm': 'Samoan',
    'gd': 'Scots Gaelic',
    'sr': 'Serbian',
    'st': 'Sesotho',
    'sn': 'Shona',
    'sd': 'Sindhi',
    'si': 'Sinhala',
    'sk': 'Slovak',
    'sl': 'Slovenian',
    'so': 'Somali',
    'es': 'Spanish',
    'su': 'Sundanese',
    'sw': 'Swahili',
    'sv': 'Swedish',
    'tg': 'Tajik',
    'ta': 'Tamil',
    'te': 'Telugu',
    'th': 'Thai',
    'tr': 'Turkish',
    'uk': 'Ukrainian',
    'ur': 'Urdu',
    'uz': 'Uzbek',
    'vi': 'Vietnamese',
    'cy': 'Welsh',
    'xh': 'Xhosa',
    'yi': 'Yiddish',
    'yo': 'Yoruba',
    'zu': 'Zulu'
};

// buat fungsi pengecekan ke index
function getISOCode(language) {
    if (!language) {
        return null;
    }
    language = language.toLowerCase();
    if (language in languages) {
        return language;
    }
    var keys = Object.keys(languages).filter(function (key) {
        return typeof languages[key] !== 'string'
            ? null
            : languages[key].toLowerCase() === language;
    });
    return keys[0] || null;
}

// fungsi sederhana untuk kode bahasa yang disupport
function isSupported(language) {
    return Boolean(getISOCode(language));
}

// Source : https://github.com/Bikin-Bot/Source-TaRianaBot/
function getPhoto(msg,id){
  var jub = tg.getFile(id)
  var hasil = jub.result.file_path
  var gasil = 'https://api.telegram.org/file/botBOTTOKEN/'+hasil
  var dasil = UrlFetchApp.fetch(gasil).getBlob().setName('MissKatyRoBot.png')
  var data = {
    'chat_id':String(msg),
    'photo': dasil,
    'caption': 'Sticker -> Image\n@MissKatyRoBot',
    'reply_to_message_id' : msg.message_id
  }
 return tg.requestForm('sendPhoto', data)
}

function getSticker(msg,id){
  var jub = tg.getFile(id)
  var hasil = jub.result.file_path
  var gasil = 'https://api.telegram.org/file/botBOTTOKEN/'+hasil
  var dasil = UrlFetchApp.fetch(gasil).getBlob().setName('sticker.png')
  var data = {
    'chat_id':String(msg),
    'sticker': dasil
  }
 return tg.requestForm('sendSticker', data)
}

function fungsi_ocr(msg, file_id) {
  var status;
  try {
    var token = "BOT_TOKEN";      
    var foto = tg.getFile(file_id);
    var urlpath = "https://api.telegram.org/file/bot"+token+"/"+foto.result.file_path; 
    var imageBlob = UrlFetchApp.fetch(urlpath).getBlob();
    var resource =
        {
          title: imageBlob.getName(),
          mimeType: imageBlob.getContentType()
        };
    
    var options = 
        {
          ocr: true
        };    
    var docFile = Drive.Files.insert(resource, imageBlob, options);
    var doc = DocumentApp.openById(docFile.id);
    var text = doc.getBody().getText().replace("n", "");
    Drive.Files.remove(docFile.id);
    status = text;
    //Logger.log("text: " + status.toString());
  } 
  catch (error)
  {    
    status = "ERROR: " + error.toString();
    //Logger.log("ERROR: " + error.toString());    
  }
  
  return tg.kirimPesan(msg.chat.id, status, 'HTML');
}
