import express from 'express';
import 'dotenv/config'
import {CognitoService, GlobalInitialzer, ApiSecurity, NetworkClient, RedisStore, ServiceNames, QueueService} from '@abhishekduttiitr1/service-util';


const app = express();


async function init() {
    //init service util and Logger with serviceName
    GlobalInitialzer.init(ServiceNames.TEST_SERVICE);
    //Secure end points
    ApiSecurity.securityCheck(app,['/someUrlToSkipSecurityCheck']);
    //Inter service call 
    await NetworkClient.get(ServiceNames.TEST_SERVICE,'/endpoint')
    await NetworkClient.post(ServiceNames.TEST_SERVICE,'/endpoint',{data:{key:'value'}})
    //Redis 
    //Required in env: REDIS_HOST
    await RedisStore.init(true);
    app.post('/addValueToRedis',async (req,res)=>{
        await RedisStore.setAsync(req.body.key,req.body.value);
    })
    app.get('/getValueFromRedis',async (req,res)=>{
        await RedisStore.getAsync(req.body.key);
    })
    //SQS
    //Following things needed in env
    // AWS_REGION
    // ENVIRONMENT
    // AWS_ACCESS_KEY_ID
    // AWS_SECRET_ACCESS_KEY
    await QueueService.init(['queue-name'])
    //Cognito
    await CognitoService.init();
    //Following env vars need to be there.
    // CognitoService.userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
    // CognitoService.isEnableStaticPassword = process.env.ENABLE_STATIC_PASSWORD === 'true';
    // CognitoService.staticPassword = process.env.STATICPASSWORD || 'Manipal@123';
    // CognitoService.clientId = process.env.AWS_COGNITO_CLIENT_ID;
    // let cognitoAWSRegion = process.env.AWS_DEFAULT_REGION;
    // if (cognitoAWSRegion) {
    //     AWS.config.update({
    //         region: cognitoAWSRegion
    //     });
    //     AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    //     AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    // }
    // CognitoService.cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
    // CognitoService.userPool = new AmazonCognitoIdentity.CognitoUserPool({UserPoolId: CognitoService.userPoolId,ClientId: CognitoService.clientId});

    // await CognitoService.authenticateUserDetails({Username:'',Password:''});
    // await CognitoService.createUser({userData:{}})



    app.get('/healthcheck',(req,res,next)=>{
        res.send('Success!!')
    })
    
    app.listen(3000,()=>{
        console.log('server is running');
    })
}

init();








