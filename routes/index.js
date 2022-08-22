const dirTree     = require("directory-tree");
const passport    = require('passport');
const moment      = require('moment');
const fs          = require('fs')
const path        = require('path');
const mime        = require('mime');


module.exports = function(app) {
  app.get('/', async function(req, res) {
    res.render('index.ejs');
  });

  app.get('/404', async function(req, res) {
    res.render('404.ejs');
  });

  app.get('/subscribe/:id', async function(req, res) { // belum ************
    res.redirect('https://apps.deka.net.id/signup');
  });

  app.get('/service/hope', async function(req, res) {
    res.render('service/hope.ejs');
  });

  app.get('/service/connex', async function(req, res) {
    res.render('service/connex.ejs');
  });

  app.post('/send-messages', async function(req, res) { // belum ************
    res.json()
  });

  app.get('/service/dedicated', async function(req, res) {
    res.render('service/dedicated.ejs');
  });

  app.get('/server-info', async function(req, res) {
    res.render('server-info.ejs');
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

  app.post('/confirm-payment', async function(req, res) { // belum ************
    res.json()
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

  app.post('/check-coverage', async function(req, res) { // belum ************
    res.json()
  });


}
