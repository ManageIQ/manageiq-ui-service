/* eslint-disable */
'use strict';

const gettextParser = require('gettext-parser');
const util = require('util');
const crypto = require('crypto');

exports.Gettext = {

  json2po: function(obj) {
    let ret = {charset: 'utf-8',
               headers: {
                 'content-type': 'text/plain; charset=UTF-8',
                 'plural-forms': ''
               },
               translations: {}
              };
    let idmap = {};

    if (obj.extensions) {
      obj.extensions.forEach((o) => {
        if (o['object-type'] === 'po-header' || o['object-type'] === 'po-target-header') {
          let msg = {msgid: '', comments: {translator: o.comment, flag: 'fuzzy'}};
          ret.translations[''] = {'': msg};

          o.entries.forEach((oo) => ret.headers[oo.key.toLowerCase()] = oo.value);
        } else {
          return Promise.reject(new Error('Unknown object type in header: ' + util.inspect(o, {depth: null, showHidden: false})));
        }
      });
    }
    if (obj.textFlows) {
      obj.textFlows.forEach((o) => {
        let msg = {msgctxt: '', msgstr: '', msgid: '', comments: {reference: []}};

        msg.msgid = o.content;
        if (o.extensions) {
          o.extensions.forEach((oe) => {
            if (oe['object-type'] === 'pot-entry-header') {
              if (oe.references) {
                oe.references.forEach((oer) => msg.comments.reference = msg.comments.reference.concat(oer.split(' ')));
                msg.comments.reference = msg.comments.reference.join('\n');
              }
              if (oe.flags)
                msg.comments.flag = oe.flags.join(',');
              if (oe.context)
                msg.msgctxt = oe.context;
            } else if (oe['object-type'] === 'comment') {
              msg.comments.extracted = oe.value;
            } else {
              return Promise.reject(new Error('Unknown object type in the text flow: ' + util.inspect(oe, {depth: null, showHidden: false})));
            }
          });
        }
        if (o.contents) {
          msg.msgid = o.contents[0];
          msg.msgid_plural = o.contents[1];
        }
        if (ret.translations[msg.msgctxt] == undefined)
          ret.translations[msg.msgctxt] = {};
        ret.translations[msg.msgctxt][o.id] = msg;
        idmap[o.id] = msg;
      });
    }
    if (obj.textFlowTargets) {
      obj.textFlowTargets.forEach((o) => {
        if (!(o.resId in idmap)) {
          return Promise.reject(new Error('Invalid resource ID in the textFlowTargets: ' + util.inspect(o, {depth: null, showHidden: false})));
        } else {
          idmap[o.resId].msgstr = o.content;
          if (o.state === 'NeedReview')
            idmap[o.resId].comments.flag = idmap[o.resId].comments.flag.split(',').concat(['fuzzy']).join(',');
          if (o.extensions) {
            o.extensions.forEach((oe) => {
              if (oe['object-type'] === 'comment') {
                idmap[o.resId].comments.translator = oe.value;
              } else {
                return Promise.reject(new Error('Unknown object type in the textFlowTargets: ' + util.inspect(oe, {depth: null, showHidden: false})));
              }
            });
          }
          if (o.contents) {
            idmap[o.resId].msgstr = o.contents;
          }
        }
      });
    }
    return Promise.resolve(gettextParser.po.compile(ret));
  },

  po2json: function(name, type, data) {
    let po = gettextParser.po.parse(data, 'utf-8');
    let ret = {name: name,
               contentType: 'application/x-gettext',
               lang: 'en-US',
               extensions: []
              };
    let ext = {};

    if (type === 'pot') {
      ret.textFlows = [];
      ext['object-type'] = 'po-header';
    } else if (type === 'po') {
      ret.textFlowTargets = [];
      ext['object-type'] = 'po-target-header';
    } else {
      return Promise.reject(new Error('Unknown conversion type: ' + type));
    }
    ext.entries = Object.keys(po.headers || {}).map((k) => {
      return {key: k, value: po.headers[k]};
    });
    if (po.translations && po.translations[''] && po.translations[''][''] && po.translations[''][''].comments)
      ext.comment = po.translations[''][''].comments.translator;
    else
      ext.comment = '';
    ret.extensions.push(ext);
    Object.keys(po.translations).forEach((ck) => {
      Object.keys(po.translations[ck]).forEach((id) => {
        if (id !== '') {
          let md5 = crypto.createHash('md5');
          let msg = po.translations[ck][id];
          let obj = {extensions: []};

          if (msg.msgctxt && msg.msgctxt != '') {
            md5.update(msg.msgctxt + '\u0000' + msg.msgid, 'utf-8');
          } else
            md5.update(msg.msgid, 'utf-8');
          let oid = md5.digest('hex');

          if (type === 'pot') {
            obj.lang = 'en-US';
            obj.id = oid;
            obj.extensions.push({'object-type': 'pot-entry-header',
                                 references: msg.comments && msg.comments.reference ? msg.comments.reference.split('\n') : [],
                                 flags: msg.comments && msg.comments.flag ? msg.comments.flag.split(',') : [],
                                 context: msg.msgctxt ? msg.msgctxt : ''});
            if (msg.comments && msg.comments.extracted)
              obj.extensions.push({'object-type': 'comment',
                                   value: msg.comments.extracted,
                                   space: 'preserve'});
            if (msg.msgid_plural) {
              obj.plural = true;
              obj.contents = [msg.msgid, msg.msgid_plural];
            } else {
              obj.plural = false;
              obj.content = msg.msgid;
            }
            ret.textFlows.push(obj);
          } else {
            obj.resId = oid;
            if (msg.comments && msg.comments.flag && msg.comments.flag.match('fuzzy'))
              obj.state = 'NeedReview';
            else
              obj.state = 'Approved';
            if (msg.msgstr instanceof Array) {
              if (msg.msgstr.length > 1)
                obj.contents = msg.msgstr;
              else
                obj.content = msg.msgstr[0];
            } else {
              obj.content = msg.msgstr;
            }
            if (msg.comments && msg.comments.translator)
              obj.extensions.push({'object-type': 'comment',
                                   value: msg.comments.translator,
                                   space: 'preserve'});
            ret.textFlowTargets.push(obj);
          }
        }
      });
    });
    return Promise.resolve(ret);
  }

}
