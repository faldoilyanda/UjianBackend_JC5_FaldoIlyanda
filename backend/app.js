const express = require('express');
const bodyParser = require('body-parser');
const database = require('mysql');
const upload = require('express-fileupload');
const crypto = require('crypto');
var koneksi = require('cors');
var app = express();

const dbs = database.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'wisemonkey',
    port: '3306'
});
dbs.connect();


var port = 8002;

app.use(koneksi());
app.use(upload());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    var panggilData = 'SELECT * FROM  produk_samid';
    dbs.query(panggilData, (kaloError, hasilQuery) => {
        if(kaloError)
        {
            throw kaloError;
        } 
        else 
        {
            res.send(hasilQuery);
        }
    });
});

app.post('/tambahData', (req, res) => {
   var namaProduk = req.body.inputSatu;
   var hargaProduk = req.body.inputDua;
   var sql = `INSERT INTO tas VALUES("${''}", "${namaProduk}", "${hargaProduk}")`;
    dbs.query(sql, (kaloError, hasilnya) => {
        if(kaloError){
            throw kaloError;
        } else {
            res.end('Data berhasil disimpan')
        }
    });
});

/** Untuk mengambil data per baris */
app.get('/getdata/:id', (req, res) => {
    /** Menyiapkan query untuk ke MySQL */
    var grabData = `SELECT * FROM produk_samid WHERE id = ${req.params.id}`;
    /** Mengeksekusi query dengan syntax nodeJS */
    dbs.query(grabData, (err, hasilquery) => {
        if(err){
            /** Mengeluarkan pesan error apabila terjadi kesalahan */
            throw err;
        } else {
            /** Menyiapkan hasil query untuk siap dikirim */
            res.send(hasilquery);
        }
    })
});

/** Untuk mengupdate data */
app.post('/ubahData', (req, res) => {
    var id = req.body.id;
    var namaProduk = req.body.namaproduk;
    var hargaProduk = req.body.harga;
    var fileName = req.files.file.name;

// Ketika dapat kiriman yang berbentuk files maka akan dijalankan fungsi ini
    if(req.files){
        
        var fungsiFile = req.files.file;

        fungsiFile.mv("./tampunganFile/"+fileName, (kaloError) => {
            if(kaloError){
                console.log(kaloError);
                res.send('Upload failed');
            } else {
                res.send('Upload berhasil');
            }
        })
    }

    var queryUpdate = `UPDATE produk_samid SET nama_produk = "${namaProduk}", 
                        harga = "${hargaProduk}", foto_produk = "${fileName}" WHERE id="${id}"`;
    dbs.query(queryUpdate, (err, result) => {
        if(err){
            throw err;
        } else {
            res.send('Update berhasil !');
        }
    });

});

app.post('/login', (req, res) => {
    var sql = `SELECT * FROM newusers`;
    dbs.query(sql, (error, result) => {
        if(error) {
            throw error;
        } else {
            var username = req.body.username;
            var password = req.body.password;

            for(var i=0; i < result.length; i++ ){
                if(username === result[i].Username && password === result[i].Password){
                    var status = 'oke';
                    res.send(status);
                    break;
                } else if(i === result.length - 1) {
                    res.send('gagal');
                }
            }
        }
    });
});

app.listen(port, () => {
    console.log('Server berjalan di port '+port+' ....')
});