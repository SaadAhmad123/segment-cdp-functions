export default `
declare var atob: typeof import('atob');
declare var AWS: typeof import('aws-sdk');
declare var btoa: typeof import('btoa');
declare var fetchretrylib: {
    fetchretry: typeof import('fetch-retry')
};
declare var FormData: typeof import('form-data');
declare var google: {
    cloud: {
        automl: typeof import('@google-cloud/automl'),
        bigquery: typeof import('@google-cloud/bigquery'),
        datastore: typeof import('@google-cloud/datastore'),
        firestore: typeof import('@google-cloud/firestore'),
        functions: typeof import('@google-cloud/functions'),
        pubsub: typeof import('@google-cloud/pubsub'),
        storage: typeof import('@google-cloud/storage'),
        tasks: typeof import('@google-cloud/tasks')
    }
};
declare var hubspotlib: {
    hubspot: typeof import('hubspot-api-nodejs')
};
declare var jsforce: typeof import('jsforce');
declare var jsonwebtoken: typeof import('jsonwebtoken');
declare var libphonenumberjslib: {
    libphonenumberjs: typeof import('libphonenumber-js')
};
declare var _: typeof import('lodash');
declare var nodemailjet: {
    nodemailjet: typeof import('mailjet') // assuming 'mailjet' provides the required methods/properties.
};
declare var moment: typeof import('moment-timezone');
declare var fetch: typeof import('node-fetch');
declare var OAuth: typeof import('oauth');
declare var sendgrid: {
    client: typeof import('@sendgrid/client'),
    mail: typeof import('@sendgrid/mail')
};
declare var skyflowlib: {
    skyflow: typeof import('skyflow') // assuming 'skyflow' provides the required methods/properties.
};
declare var stripe: typeof import('stripe');
declare var twilio: typeof import('twilio');
declare var uuidv5: {
    uuidv5: typeof import('uuidv5').uuidv5
};
declare var winstonlib: {
    winston: typeof import('winston')
};
declare var xml: typeof import('xml');
declare var xml2js: typeof import('xml2js');
declare var zlib: {
    zlib: typeof import('zlib').zlib
};
declare class RetryError extends Error {}
declare class EventNotSupported extends Error {}
`