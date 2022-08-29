const dirTree     = require("directory-tree");
const passport    = require('passport');
const moment      = require('moment');
const fs          = require('fs')
const path        = require('path');
const mime        = require('mime');
const request     = require('request');

const appspage    = 'https://apps.deka.net.id/'

module.exports = function(app) {
  app.get('/', async function(req, res) {
    res.render('index.ejs');
  });

  app.get('/404', async function(req, res) {
    res.render('404.ejs');
  });

  app.get('/subscribe/:id', async function(req, res) { // belum ************
    var id = req.params.id
    res.redirect('/contact');
  });

  app.get('/service/hope', async function(req, res) {
    res.render('service/hope.ejs');
  });

  app.get('/service/connex', async function(req, res) {
    res.render('service/connex.ejs');
  });

  app.post('/send-messages', async function(req, res) {
    var data = req.body

    request.post(
      appspage+'web/messages',
      data,
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.json({status: true})
        } else {
          res.json({status: false})
        }
      }
    );

  });

  app.get('/service/dedicated', async function(req, res) {
    res.render('service/dedicated.ejs');
  });

  app.get('/server-info', async function(req, res) {
    res.render('server-info.ejs', {info: [
      // {
      //   type : 'GANGGUAN',
      //   title : 'Gangguan Jaringan',
      //   date : 'Senin, 12 Agustus 2022',
      //   description : 'Terjadi masalah kelistrikan pada salah satu BTS Deka. Berdampak pada terputusnya koneksi untuk beberapa pelanggan',
      //   location : 'BTS',
      //   action : 'Perbaikan dan penambahan backup kelistrikan pada BTS terdampak',
      //   status : 'Menunggu',
      // }
    ]});
  });

  app.get('/send-messages', async function(req, res) {
    res.render('send-messages.ejs');
  });

  app.get('/asked', async function(req, res) {
    res.render('asked.ejs');
  });

  app.get('/confirm-payment', async function(req, res) {
    res.render('confirm-payment.ejs');
  });

  app.post('/confirm-payment', async function(req, res) {
    var data = req.body

    request.post(
      appspage+'web/confirm-payment',
      data,
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.json({status: true})
        } else {
          res.json({status: false})
        }
      }
    );
  });

  app.get('/contact', async function(req, res) {
    res.render('contact.ejs');
  });

  app.get('/coverage', async function(req, res) {
    res.render('coverage.ejs');
  });

  app.get('/privacy', async function(req, res) {
    res.render('privacy.ejs');
  });

  app.get('/bod', async function(req, res) {
    res.render('bod.ejs');
  });

  app.get('/simulasi', async function(req, res) {
    res.render('simulasi.ejs');
  });

  app.get('/promo', async function(req, res) {
    res.render('promo.ejs');
  });

  app.get('/partnership', async function(req, res) {
    res.render('partnership.ejs');
  });

  app.post('/check-coverage', async function(req, res) {
    var data = req.body
    
    request.post(
      appspage+'web/coverage',
      data,
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res.json({status: true})
        } else {
          res.json({status: false})
        }
      }
    );
  });


}
