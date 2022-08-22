const {exec}      = require("child_process");
const fs          = require('fs');
const archiver    = require('archiver');
const unzipper    = require('unzipper');

module.exports = {
  mongodb         : 'mongodb://localhost:27017/deka',
  mongoBackup     : (dbname='ust', callback=()=>{}) => {
    let date  = new Date().getTime()
    const cmd = 'mongodump --db '+dbname+' --out ' + 'temp/db/'+date
    let zipname = date+'.zip'

    console.log("Pencadangan basis data dimulai . . . ");

    exec(cmd, function(error, stdout, stderr) {
      if (!error) {
        var output = fs.createWriteStream('backup/'+zipname);
        var archive = archiver('zip');

        output.on('close', function () {
          callback({
            status : true,
            size : archive.pointer(),
            filename : zipname
          })
        });

        archive.on('error', function(err){
          callback({
            status : false,
            message : err
          })
        });

        archive.pipe(output);
        archive.directory('temp/db/'+date+'/'+dbname, false);
        archive.finalize();
      } else {
        callback({
          status : false,
          message : error
        })
      }
    });
  },
  restoreDB       : ( dbname='ust', date, mongoose, callback) => {
    try {
      fs.createReadStream('temp/'+date+'.zip')
      .pipe(unzipper.Extract({ path: 'temp/restore/'+date }))
      .on('close', function () {
        var cmd = 'mongorestore --db ' + dbname + ' ' +'temp/restore/'+date
        mongoose.connection.db.dropDatabase();
        exec(cmd, function(error, stdout, stderr) {
          if (!error) {
            callback({
              status : true,
              message : 'Berhasil menyimpan basis data'
            })
          } else {
            callback({
              status : false,
              message : 'gagal menyimpan basis data'
            })
          }
        })
      });
    } catch (e) {
      callback({
        status : true,
        message : 'Gagal memproses berkas'
      })
    } finally {

    }
  }
};
