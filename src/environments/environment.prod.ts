// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
// http://vendor.ustechatsapp.net
// http://localhost:8081/ecospace-v2-client/api
export const environment = {
    production: false,
    GTM_ID: 'UA-167790148-3',
    baseApiUrl: 'https://api.jobboard.zepptalentz.com/job_board_bknd/public/api/v1',
    baseApiUrlClient: 'https://api.jobboard.zepptalentz.com/job_board_bknd/public/api/v1',
    // baseApiUrl: 'http://localhost/recruit-service/public/api/v1',
    // baseApiUrlClient: 'http://localhost/recruit-service/public/api/v1',
    // baseApiUrl: 'https://dev-api.simplifyhire.com/api/v1',
    // baseApiUrlClient: 'https://dev-api.simplifyhire.com/api/v1',
    // baseApiUrl: 'https://uat-api.simplifycareers.com/api/v1',
    // baseApiUrlClient: 'https://uat-api.simplifycareers.com/api/v1',
    // baseApiUrl: 'http://simplify.test/api/v1',
    // baseApiUrlClient: 'http://simplify.test/api/v1',
    array : {
        new_sumission:  'Submitted',
        pending_offer : 'You have an pending offer',
        submission_rejected: 'Your submission rejected',
        interview: 'Interview Scheduled',
        applicaiton_accepted: 'Application accepted',
        hired: 'Hired',
    },
    GRAPHICAL_URL: "",
    MODE: 'dev',
    PRODUCT: 'career',
  
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/dist/zone-error';  // Included with Angular CLI.
  