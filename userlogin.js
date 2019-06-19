const Util = require('./Util');
const websiteTable = Util.getTableName('website');
const userTable = Util.getTableName('user');
const pageTable = Util.getTableName('page');
const componentsTable = Util.getTableName('components');
const uuidv4 = require('uuid/v4');

module.exports = {
    async login(event) {
        console.log('event.queryStringParameters.userId', event.queryStringParameters.userId)
        const paramsUserId = event.queryStringParameters.userId;

        const authenticatedUser = await getUserByUsername(paramsUserId);

        return Util.envelop({
            user: authenticatedUser,

        });
        //
        // if (!authenticatedUser) {
        //     return Util.envelop('We can\'t find you.', 422);
        // }
        // const userWebsites = await getUserWebsite(authenticatedUser.id)
        // if (userWebsites.length === 0) {
        //     return Util.envelop('You don\'t have any websites', 422);
        // }
        // if (userWebsites.length > 1) {
        //     return Util.envelop({
        //         user: authenticatedUser,
        //         dashboard: 'www.sembler.io/dashboard'
        //     });
        // }
        //
        // const intialPage = await getPageByWebsiteId(userWebsites.init_pageId.id);
        // const components = getComponentsByPageId(intialPage.id);
        //
        // return Util.envelop({
        //     user: authenticatedUser,
        //     website: userWebsites,
        //     intialPage: intialPage,
        //     components: components
        // });
    }
};
function getUserByUsername(aUsername) {
    return Util.DocumentClient.query({
        TableName: userTable,
        IndexName: 'usernameIndex',
        KeyConditionExpression: 'username = :username',
        ExpressionAttributeValues: {
            ':username': aUsername,
        },
        Select: 'ALL_ATTRIBUTES',
    }).promise();
}
function getUserWebsite(aUserId) {
    return Util.DocumentClient.get({
        TableName: websiteTable,
        Key: {
            userId: aUserId,
        },
    }).promise();
}
function getPageByWebsiteId(aWebsiteId) {
    return Util.DocumentClient.get({
        TableName: pageTable,
        Key: {
            websiteId: aWebsiteId,
        },
    }).promise();
}
function getComponentsByPageId(aPageId) {
    return Util.DocumentClient.get({
        TableName: componentsTable,
        Key: {
            pageId: aPageId,
        },
    }).promise();
}
