// 00. -- permulaan aplikasi
// inisasi pertama kali
var tg = new telegram.daftar();

// variable user untuk interaksi dengan store user properties
var script = new telegram.user();

// bot token lib buttx
var bot = new butthx.bot('TOKEN_BOT')

// sesuaikan zona waktu kalian masing-masing ya.
let zonaTime = 'GMT+7'

// masukkan ID User/Tujuan Bot akan membroadcast jadwal sholat
// ID User/Grup/Channel
var tujuanID = [617426792];

// masukkan ID user kamu, untuk mendapatkan notif jika bot terjadi error
let adminBot = 617426792;

// variable penampung username bot
// misal:var usernamebot = 'gedebugbot';
var usernamebot = 'UsernameBot';

// variable minisheetDB
var db = new miniSheetDB.init('IDSheet','namaSheet')

// . klo sudah oke hapus dari sini -->

// 01. -- jalankan fungsi ini cuma sekali saja kemudian hapus functionnya!
function simpanToken() {
  // isikan token dari @BotFather  
  var token = "TOKEN_BOT";
  
  // store token ke user Properties
  return script.setValue('token_'+usernamebot, token);
}
// untuk cek token
function cekToken() {
  var token = script.getValue('token_'+usernamebot);
  Logger.log(token);
}
// . hapusnya sampe sini saja <--

// 02. -- Pengambilan dan pemasangan token
var token = script.getValue('token_'+usernamebot);
tg.setToken(token);

// 03. -- setWebhook
function setWebhook() {
  var url = "URL_HASIL_DEPLOY";
  var r = tg.setWebhook(url);
  Logger.log(r);
}

// -- kalau mau bikin fungsi sendiri, taruh di bawah sini ---

function getMe(){
  var me = tg.getMe();
  Logger.log(me);
}

function getWebhookInfo() {
  var r = tg.getWebhookInfo();
  Logger.log(r);
}

function deleteWebhook() {
  var r = tg.deleteWebhook();
  Logger.log(r);
}
