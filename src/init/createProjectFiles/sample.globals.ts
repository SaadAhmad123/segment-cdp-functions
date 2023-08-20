export default `
// Import the libraries
import _atob from 'atob';
import * as _AWS from 'aws-sdk';
import _btoa from 'btoa';
import * as _fetchretry from 'fetch-retry';
import * as _FormData from 'form-data';
import * as _googleCloudAutoml from '@google-cloud/automl';
import * as _googleCloudBigquery from '@google-cloud/bigquery';
import * as _googleCloudDatastore from '@google-cloud/datastore';
import * as _googleCloudFirestore from '@google-cloud/firestore';
import * as _googleCloudFunctions from '@google-cloud/functions';
import * as _googleCloudPubsub from '@google-cloud/pubsub';
import * as _googleCloudStorage from '@google-cloud/storage';
import * as _googleCloudTasks from '@google-cloud/tasks';
import * as _hubspotLib from '@hubspot/api-client';
// @ts-ignore
import * as _jsforce from 'jsforce';
// @ts-ignore
import * as _jsonwebtoken from 'jsonwebtoken';
import * as _libphonenumberjslib from 'libphonenumber-js';
import * as _lodash from 'lodash';
// @ts-ignore
import * as _nodemailjet from 'mailjet';
import * as _moment from 'moment-timezone';
// @ts-ignore
import * as _fetch from 'node-fetch';
// @ts-ignore
import * as _OAuth from 'oauth';
import * as _sendgridClient from '@sendgrid/client';
import * as _sendgridMail from '@sendgrid/mail';
// @ts-ignore
import * as _skyflowlib from 'skyflow';
import * as _stripe from 'stripe';
import * as _twilio from 'twilio';
// @ts-ignore
import * as _uuidv5lib from 'uuidv5';
import * as _winstonLib from 'winston';
// @ts-ignore
import * as _xml from 'xml';
// @ts-ignore
import * as _xml2js from 'xml2js';
import * as _zlibLib from 'zlib';

// Expose them as globals
(global as any).atob = _atob;
(global as any).AWS = _AWS;
(global as any).btoa = _btoa;
(global as any).fetchretrylib = { fetchretry: _fetchretry };
(global as any).FormData = _FormData;
(global as any).google = {
    cloud: {
        automl: _googleCloudAutoml,
        bigquery: _googleCloudBigquery,
        datastore: _googleCloudDatastore,
        firestore: _googleCloudFirestore,
        functions: _googleCloudFunctions,
        pubsub: _googleCloudPubsub,
        storage: _googleCloudStorage,
        tasks: _googleCloudTasks
    }
};
(global as any).hubspotlib = { hubspot: _hubspotLib };
(global as any).jsforce = _jsforce;
(global as any).jsonwebtoken = _jsonwebtoken;
(global as any).libphonenumberjslib = { libphonenumberjs: _libphonenumberjslib };
(global as any)._ = _lodash;
(global as any).nodemailjet = { nodemailjet: _nodemailjet };
(global as any).moment = _moment;
(global as any).fetch = _fetch;
(global as any).OAuth = _OAuth;
(global as any).sendgrid = { client: _sendgridClient, mail: _sendgridMail };
(global as any).skyflowlib = { skyflow: _skyflowlib };
(global as any).stripe = _stripe;
(global as any).twilio = _twilio;
(global as any).uuidv5 = { uuidv5: _uuidv5lib };
(global as any).winstonlib = { winston: _winstonLib };
(global as any).xml = _xml;
(global as any).xml2js = _xml2js;
(global as any).zlib = { zlib: _zlibLib };`