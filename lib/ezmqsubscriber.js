/*******************************************************************************
 * Copyright 2018 Samsung Electronics All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *******************************************************************************/

//Module dependencies.
var ezmqsub = require('../build/Release/ezmq.node'),
    ezmqEvent = require('./ezmqevent.js'),
    ezmqByteData = require('./ezmqbytedata.js');

//Expose bindings as the module.
exports = module.exports = ezmqsub;

var nezmqSub;
/**
 * @class This class represent EZMQSubscriber. It contains APIs to
 *              start/stop subscriber and to subscribe for data.<br><br>
 *
 * <b>ProtoType of subCB</b> :-  function subCallback(event) {}<br>
 * <b>ProtoType of subTopicCB</b> :- function subTopicCallback(topic, event){}<br><br>
 *
 * In callback event will be <b>EZMQEvent/EZMQByteData</b><br>
 *
 * @constructor
 * @param {string} ip -IP address.
 * @param {number} port -Port number.
 * @param {Callback} subCB - Callback to be called whenever received any event.
 * @param {Callback} subTopicCB - Callback to be called whenever received any event on topic.
 */
var EZMQSubscriber = (exports.EZMQSubscriber = function(
    ip,
    port,
    subCB,
    subTopicCB
) {
    this.nezmqSub = new ezmqsub.NEZMQSubscriber(
        ip,
        port,
        function(event) {
            var contentType = event.getContentType();
            if (0 == contentType) {
                var protoEvent = new ezmqsub.EZMQEvent();
                protoEvent.setAddonObj(event);
                subCB(protoEvent);
            } else if (1 == contentType) {
                var byteEvent = new ezmqsub.EZMQByteData(0, 0);
                byteEvent.setAddonObj(event);
                subCB(byteEvent);
            }
        },

        function(topic, event) {
            var contentType = event.getContentType();
            if (0 == contentType) {
                var protoEvent = new ezmqsub.EZMQEvent();
                protoEvent.setAddonObj(event);
                subTopicCB(topic, protoEvent);
            } else if (1 == contentType) {
                var byteEvent = new ezmqsub.EZMQByteData(0, 0);
                byteEvent.setAddonObj(event);
                subTopicCB(topic, byteEvent);
            }
        }
    );
});

/**
 * Set the security keys of client/its own.<br>
 *
 * <b>Note:</b> <br>
 * (1) Key should be 40-character string encoded in the Z85 encoding format <br>
 * (2) This API should be called before start() API.
 *
 * @param {string} clientPrivateKey - Client private/secret key.
 * @param {string} clientPublicKey - Client public key.
 *
 * @return {EZMQErrorCode} EZMQ_OK on success, otherwise appropriate error code.
 *
 * @throws Will throw an error, if security is not enabled while building.
 */
EZMQSubscriber.prototype.setClientKeys = function(clientPrivateKey, clientPublicKey) {
	return this.nezmqSub.setClientKeys(clientPrivateKey, clientPublicKey);
};

/**
 * Set the server public key.<br>
 *
 * <b>Note:</b> <br>
 * (1) Key should be 40-character string encoded in the Z85 encoding format <br>
 * (2) This API should be called before start() API.
 * (3) If using the following API in secured mode: <br>
 *      subscribeWithIPPort then,
 *      setServerPublicKey API needs to be called before that.
 *
 * @param {string} serverPublicKey - Server public key.
 *
 * @return {EZMQErrorCode} EZMQ_OK on success, otherwise appropriate error code.
 *
 * @throws Will throw an error, if security is not enabled while building.
 */
EZMQSubscriber.prototype.setServerPublicKey = function(serverPublicKey) {
	return this.nezmqSub.setServerPublicKey(serverPublicKey);
};

/**
 * Starts SUB instance.
 *
 * @return {EZMQErrorCode} EZMQ_OK on success, otherwise appropriate error code.
 */
EZMQSubscriber.prototype.start = function() {
    return this.nezmqSub.start();
};

/**
 * Subscribe for event/messages. This API can be called to subscribe for all events or
 * subscribe events for given topic/s.<br>
 *
 * <b>Note:</b> <br>
 * (1) If API is called without topic, it will subscribe for all the events. <br>
 * (2) Topic can be a single topic [String] or list of topic [String list]. <br>
 * (3) Topic name should be as path format. For example: home/livingroom/<br>
 * (4) Topic name can have letters [a-z, A-z], numerics [0-9] and special characters _ - . and /
 *
 * @param {string/stringlist} topic -Subscribe for given topic. It can be empty.
 *
 * @return {EZMQErrorCode} EZMQ_OK on success, otherwise appropriate error code.
 */
EZMQSubscriber.prototype.subscribe = function(topic) {
    if (typeof topic === 'undefined') {
        return this.nezmqSub.subscribe();
    }
    if (typeof topic === 'string') {
        return this.nezmqSub.subscribeOnTopic(topic);
    }
    return this.nezmqSub.subscribeOnList(topic);
};

/**
 * Subscribe for event/messages from given IP:Port on the given topic.<br>
 *
 * <b>Note:</b> <br>
 * (1) It will be using same Subscriber socket for connecting to given ip:port. <br>
 * (2) To unsubcribe use un-subscribe API with the same topic. <br>
 * (3) Topic name should be as path format. For example: home/livingroom/ <br>
 * (4) Topic name can have letters [a-z, A-z], numerics [0-9] and special characters _ - . and / <br>
 * (5) Topic will be appended with forward slash [/] in case, if application has not appended it <br>
 * (6) If using in secured mode: Call setServerPublicKey(serverPublicKey) API with target server
 *      public key before calling this API.
 *
 * @param {string} ip -Target[Publisher] IP address.
 * @param {number} port -Target[Publisher] Port number.
 * @param {string} topic -Topic to be subscribed.
 *
 * @return {EZMQErrorCode} EZMQ_OK on success, otherwise appropriate error code.
 */
EZMQSubscriber.prototype.subscribeWithIPPort = function(ip, port, topic) {
	return this.nezmqSub.subscribeWithIPPort(ip, port, topic);
};

/**
 * Un-Subscribe for event/messages. This API can be called to unSubscribe for all events or
 * unSubscribe events for given topic/s.<br>
 *
 * <b>Note:</b> <br>
 * (1) If API is called without topic, it will unsubscribe for all the events. <br>
 * (2) Topic can be a single topic [String] or list of topic [String list]. <br>
 * (3) Topic name should be as path format. For example: home/livingroom/<br>
 * (4) Topic name can have letters [a-z, A-z], numerics [0-9] and special characters _ - . and /
 *
 * @param {string/stringlist} topic -UnSubscribe for given topic. It can be empty.
 *
 * @return {EZMQErrorCode} EZMQ_OK on success, otherwise appropriate error code.
 */
EZMQSubscriber.prototype.unSubscribe = function(topic) {
    if (typeof topic === 'undefined') {
        return this.nezmqSub.unSubscribe();
    }
    if (typeof topic === 'string') {
        return this.nezmqSub.unSubscribeOnTopic(topic);
    }
    return this.nezmqSub.unSubscribeOnList(topic);
};

/**
 * Stops SUB instance.
 *
 * @return {EZMQErrorCode} EZMQ_OK on success, otherwise appropriate error code.
 */
EZMQSubscriber.prototype.stop = function() {
    return this.nezmqSub.stop();
};

/**
 * Get the IP address of the publisher.
 *
 * @return {string} IP address.
 */
EZMQSubscriber.prototype.getIp = function() {
    return this.nezmqSub.getIp();
};

/**
 * Get the port of the subscriber.
 *
 * @return {number} Port number.
 */
EZMQSubscriber.prototype.getPort = function() {
    return this.nezmqSub.getPort();
};
