const Util = require('./Util');
const websiteTable = Util.getTableName('website');
const userTable = Util.getTableName('user');
const pageTable = Util.getTableName('page');
const componentsTable = Util.getTableName('components');
const uuidv4 = require('uuid/v4');
/**
 * @module Website
 */
// exports.handler = async (event) => {
module.exports = {
    /** Create user */
    async create(event) {

        const userData = JSON.parse(event.body);
        const user = {
            id: uuidv4(),
            username: userData.username,
        };
        console.log(event.body);
        console.log(user);
        await Util.DocumentClient.put({
            TableName: userTable,
            Item: user,
        }).promise();

        const pageId = uuidv4();
        const website = {
            id: uuidv4(),
            name: `Site`,
            subDomain: `${user.id}.sembler.io`,
            enable_domain: false,
            status: 'unpublished',
            init_pageId: {
                id: pageId,
                name: 'Home',
                path: '/home',
            },
            userId: user.id,
            protocol_https: false,
            order: 1
        };

        await Util.DocumentClient.put({
            TableName: websiteTable,
            Item: website,
        }).promise();

        const page = {
            id: pageId,
            name: 'Home',
            path: '/home',
            websiteId: `${website.id}`,
            order: 1,
            userId: `${user.id}`
        };
        await Util.DocumentClient.put({
            TableName: pageTable,
            Item: page,
        }).promise();
        return Util.envelop({
            user: user,
            website:website,
            page:page
        });
    }
};
function getUserByUsername(aUsername) {
    return Util.DocumentClient.get({
        TableName: userTable,
        Key: {
            username: aUsername,
        },
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
