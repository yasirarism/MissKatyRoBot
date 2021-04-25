// aktifkan jika ingin mencobanya
// jangan lupa di set false, sesudah selesai mencoba
// (jika tak mengerti, biarkan saja false)
let waktuTest = false

// Ganti lokasi ini dengan lokasi kota / kabupaten yang akan dicari
let lokasi = 'Boyolali'

// sesuikan ID lokasi (kota/kabupaten)
// untuk mendapatkannya, jalankan dulu fungsi cariIDLokasi() 
// Contoh berikut ini adalah untuk kabupaten Kediri
let idLokasi = 1405;

// atur berapa menit pesan reminder akan dihapus
var menitHapus = 10

// ini tidak usah diubah, dicopas/diketik saja
var jadwalHapus = script.getValue('jadwalHapus');
jadwalHapus = jadwalHapus ? JSON.parse(jadwalHapus) : false;


// aktifkan notif reminder untuk waktu-waktu berikut ini
// jika aktif = true, dinonaktifkan = false
let aktif = {
  imsak: true,
  subuh: true,
  terbit: false,
  dhuha: false,
  dzuhur: true,
  ashar: true,
  maghrib: true,
  isya: true
}

// format pesan, silakan dihapus atau disesuaikan dengan kebutuhan
// template tersedia {lokasi} {daerah} {hariTanggal} {waktu} {jadwal} {jadwalSemua}
// menggunakan format HTML untuk tebal, miring, garis bawah, dan monospace
// detail format silakan baca: https://bit.ly/gas2_format_text
// diapit dengan petik 1 kebalik

let templatePesan = `🕌 Pukul <code>{waktu}</code> WIB, waktunya <b>{jadwal}</b> untuk {lokasi}, {daerah} dan sekitarnya.

📑 Jadwal Imsyakiyah hari ini <b>{hariTanggal}</b> :

<code>{jadwalSemua}</code>

🔖 <u>Sumber</u>: Kemenag RI`


// quote random 
// silakan diisi sendiri, jika diperlukan.
let dataQuote = [
  'Kunci bahagia ada 3: sabar, syukur dan ikhlas.\n<b>Sabar</b> jika sedang susah, ber- <b>syukur</b> jika bahagia. Dan <b>ikhlas</b> di semua keadaan.',
  'Jangan lupa tersenyum, untuk cinta dan persahabatan. Karena itu sedekah yang paling mudah ^^',
  'Tak ada yang abadi, kecuali Dia yang sempurna.',
  'Perbanyak mengingat kematian, karena itu kepastian dan pengingat kita akan kembali.',
  'Dan tiadalah kehidupan dunia ini melainkan hanya senda gurau dan main-main. Dan sesungguhnya akhirat itulah yang sebenarnya kehidupan, jika saja mereka mengetahui.',
  'Dunia ini hanya memiliki tiga hari: Hari kemarin, ia telah pergi bersama dengan semua yang menyertainya. Hari esok, kamu mungkin tak akan pernah menemuinya. Hari ini, itulah yang kamu miliki, maka beramallah di hari ini.',
  'Hidup tanpa Allah ibarat sebuah pensil tumpul, ia tidak memiliki titik.',
  'Hidup adalah sebuah perjalanan, yakni perjalanan dari Allah yang kemudian kembali lagi kepada Allah.',
  'Kesabaran itu ada dua macam: sabar atas sesuatu yang tidak kau ingin dan sabar menahan diri dari sesuatu yang kau ingini.',
  'Kehidupan dunia dan akhirat di hati seorang manusia ibarat dua skala keseimbangan, ketika salah satunya menjadi berat, maka yang lain akan menjadi ringan.',
  'Dialah yang menghidupkan dan mematikan, dan hanya kepada-Nya lah kamu akan dikembalikan.',
  'Kehidupan itu cuma dua hari. Satu hari berpihak kepadamu dan satu hari melawanmu. Maka pada saat ia berpihak kepadamu, jangan bangga dan gegabah; dan pada saat ia melawanmu bersabarlah. Karena keduanya adalah ujian bagimu.',
  'Apa yang ada di dunia ini tidak lain hanyalah mimpi yang dialami oleh orang yang sedang tidur? Dia merasakan kesenangan di dalamnya selama beberapa saat, dan kemudian terbangun untuk menghadapi kenyataan.',
  'Dunia ini penjara bagi orang beriman dan surga bagi orang kafir.'
]
let quoteRandom = tg.util.random(dataQuote)

// template custom
// untuk membuat pengingat yang beda pada jadwal waktu tertentu
// jika tidak ingin di custom, kasih aja false yang berarti pakai templatePesan di atas
// berikut ini contoh-contohnya:
let customPesan = {
  imsak: '⚠️ Pukul <code>{waktu}</code> WIB, waktunya <b>{jadwal}</b>. Shubuh 10 menit lagi! <i>Siap-siap yak.</i>',
  subuh: false,
  terbit: false,
  dhuha: "🌥 Sudah masuk waktu {jadwal}. Sunnah tunaikan sholat {jadwal} yaa.",
  dzuhur: false,
  ashar: templatePesan + "\n\n" + quoteRandom,
  maghrib: templatePesan + "\n\n" + quoteRandom,
  isya: '🕌 Pukul <code>{waktu}</code> WIB, waktunya <b>{jadwal}</b> untuk {lokasi}, {daerah} dan sekitarnya.'
}

// --- //-// --- // 
// --- UNTUK PEMULA: cukup diatas itu saja yang diubah ---
// --- //-// --- // 

function tambahJadwalPenghapusan(chat_id, message_id) {
  let date = new Date();
  date.setMinutes(date.getMinutes() + menitHapus)

  let waktu = Utilities.formatDate(date, 'GMT+7', "HH:mm")
  let data =
  {
    waktu: waktu,
    chat_id: chat_id,
    message_id: message_id
  }

  if (!jadwalHapus) return script.setValue('jadwalHapus', JSON.stringify([data]));

  jadwalHapus.push(data);
  return script.setValue('jadwalHapus', JSON.stringify(jadwalHapus));
}


// base URL
let base_url_api = 'https://api.myquran.com/v1'
let fetchAPI = new tg.fetch(base_url_api)

// jalankan untuk mendapatkan ID lokasi
function cariIDLokasi() {
    let data = fetchAPI.get('/sholat/kota/cari/' + lokasi)
    Logger.log(tg.util.outToJSON(data, 1))
    return data;
}

function deleteJadwalSholat() {
    script.delete('sholat');
}

function getAPISholat() {
    try {
        let waktu = Utilities.formatDate(new Date(), zonaTime, "yyyy-MM")
        let pecah = waktu.split('-')
        let tahun = pecah[0]
        let bulan = pecah[1]

        // dapatkan jadwal langsung 1 bulan
        var hasil = fetchAPI.get('/sholat/jadwal/' + idLokasi + '/' + tahun + '/' + bulan)
        if (!hasil.status) return hasil;
        hasil.data.bulan = bulan
        script.setValue('sholat', JSON.stringify(hasil))
        let data = hasil.data;
        Logger.log(`${data.id}\n\n${data.lokasi}\n${data.daerah}` + '\n\nMendapatkan ' + data.jadwal.length + ' jadwal data.')
    } catch (e) {
        var hasil = { status: false, message: e.message }
    }
    return hasil;
}

function getDBholat() {
    let sholat = script.getValue('sholat')
    if (!sholat) return { status: false, message: 'Tidak ada data.' };
    sholat = JSON.parse(sholat)

    let bulan = Utilities.formatDate(new Date(), zonaTime, "MM")
    if (!sholat.data.bulan) return { status: false, message: 'Tidak ada field bulan' };
    if (!sholat.data.bulan == bulan) return { status: false, message: 'Tidak terdapat data bulan ' + bulan };

    var hasil = sholat
    let data = hasil.data;
    Logger.log(`getDBholat: ${data.id}\n\n${data.lokasi}\n${data.daerah}` + '\n\nTerdapat ' + data.jadwal.length + ' jadwal data.')
    // Logger.log(`sample: ${tg.util.outToJSON(data.jadwal[0])}`)
    return hasil;
}

function tampilkanJadwal() {
    let infoSholat = getDBholat()
    let jadwal = ''

    if (!infoSholat.status) {
        let ret = getAPISholat()
        return tg.sendMessage(adminBot, `🚫 ${infoSholat.message ? infoSholat.message : '-'}\n⏳ Proses mendapatkan data API Sholat.\n🔖 Hasil: ${ret.status ? '✅ sukses.' : '📛 ' + ret.message}`)
    }

    let date = new Date()
    let waktuSekarang = Utilities.formatDate(date, zonaTime, "HH:mm")
    let tanggalSekarang = Utilities.formatDate(date, zonaTime, "dd")

    let index = parseInt(tanggalSekarang) - 1
    let data = infoSholat.data

    // variable pengganti template
    let lokasi = data.lokasi
    let daerah = data.daerah
    let hariTanggal = data.jadwal[index].tanggal
    let waktu = waktuSekarang;
    let jadwalSemua = ''
    let pesan = templatePesan

    let kirim = false;

    // Tambah reminder sahur
    aktif.sahur = true
    data.jadwal[index].sahur = '03:00'
    customPesan.sahur = "Banguuunnn, waktunya sahuuurrr udah jam 3 pagi nih..."

    // test case untuk versi develop
    aktif.test = waktuTest
    data.jadwal[index].test = waktuSekarang
    customPesan.test = templatePesan + '\n\n 💬 ini adalah quote test\n\n' + quoteRandom
    if (!waktuTest) {
        delete aktif.test;
        delete data.jadwal[index].test;
    }

    tg.util.forEach(data.jadwal[index], (data, kunci) => {
        if (aktif[kunci]) {
            if (data == waktuSekarang) {
                jadwalSemua += `\n -> ${kunci.padStart(7, ' ')}: ${data}`;
                jadwal = kunci.charAt(0).toUpperCase() + kunci.slice(1)
                if (customPesan[kunci]) pesan = customPesan[kunci]
                kirim = true
            } else {
                jadwalSemua += `\n ${kunci.padStart(10, ' ')}: ${data}`;
            }
        }
    })

    jadwalSemua = jadwalSemua.replace('\n', '');

    // Logger.log(`${lokasi}, ${daerah} - ${waktu}\n${jadwal}`)

    // kode hari mulai hari senin
    let kodeHari = Utilities.formatDate(new Date(), zonaTime, 'u')
    
    if (parseInt(kodeHari) == 5 && jadwal.toLowerCase() == 'dzuhur')
    jadwal = "Sholat Jum'at"


    pesan = pesan
        .replace(/{lokasi}/gi, lokasi)
        .replace(/{daerah}/gi, daerah)
        .replace(/{waktu}/gi, waktu)
        .replace(/{hariTanggal}/gi, hariTanggal)
        .replace(/{jadwal}/gi, jadwal)
        .replace(/{jadwalSemua}/gi, jadwalSemua)

    Logger.log(pesan);

    if (kirim) {
        try {
          tujuanID.forEach((id) => {
            var res = tg.sendMessage(id, pesan, 'HTML')
            tambahJadwalPenghapusan(res.result.chat.id, res.result.message_id)
          })
        } catch (e) {
            tg.sendMessage(adminBot, e.message)
        }
    }

  if (jadwalHapus) {
    let indexHapus = []
    tg.util.forEach(jadwalHapus, (data, index) => {
      if (data.waktu == waktuSekarang) {
        try {
          tg.deleteMessage(data.chat_id, data.message_id)
        } catch(e) {
          // tidak perlu dicatch
        }
        indexHapus.push(index)
      }
    })

    // dibuat terpisah, karena bisa jadi waktunya sama (multi tujuan ID)
    if (indexHapus.length > 0) {
      indexHapus.sort().reverse()

      indexHapus.forEach((data) => {
        jadwalHapus.splice(data, 1)
      })
      script.setValue('jadwalHapus', JSON.stringify(jadwalHapus))
    }
  }
}
