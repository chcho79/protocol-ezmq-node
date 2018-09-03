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
var ezmqpub = require('../build/Release/ezmq.node'),
    ezmqEvent = require('./ezmqevent.js'),
    ezmqByteData = require('./ezmqbytedata.js');

//Expose bindings as the module.
exports = module.exports = ezmqpub;

var nezmqPub;
/**
 * @class This class represent EZMQPublisher. It contains APIs to
 *              start/stop publisher and to publish data. <br><br>
 *
 * <b>ProtoType of startCB</b> :- function startCB(erroCode) {} <br>
 * <b>ProtoType of stopCB</b> :- function stopCB(erroCode){}  <br>
 * <b>ProtoType of errorCB</b> :- function errorCB(erroCode){} <br><br>
 *
 * <b>Note:</b> As of now callbacks are not being used. <br>
 *
 * @constructor
 * @param {number} port -Port number.
 * @param {callback} startCB -Start callback.
 * @param {callback} stopCB -Stop callback.
 * @param {callback} errorCB -Error callback.
 */
var EZMQPublisher = (exports.EZMQPublisher = function(
    port,
    startCB,
    stopCB,
    errorCB
) {
    this.nezmqPub = new ezmqpub.NEZMQPublisher(port, startCB, stopCB, errorCB);
});

/**
 * Set the server private/secret key.<br>
 *
 * <b>Note:</b> <br>
 * (1) Key should be 40-character string encoded in the Z85 encoding format <br>
 * (2) This API should be called before start() API.
 *
 * @param {string} serverPrivateKey - Server private/Secret key.
 *
 * @return {EZMQErrorCode} EZMQ_OK on success, otherwise appropriate error code.
 *
 * @throws Will throw an error, if security is not enabled while building.
 */
EZMQPublisher.prototype.setServerPrivateKey = function(serverPrivateKey) {
	return this.nezmqPub.setServerPrivateKey(serverPrivateKey);
};

/**
 * Starts PUB instance.
 *
 * @return {EZMQErrorCode} EZMQ_OK on success, otherwise appropriate error code.
 */
EZMQPublisher.prototype.start = function() {
    return this.nezmqPub.start();
};

/**
 * Publish data on the socket for subscribers with/without topic/s.
 * Data can be EZMQEvent or EZMQByteData.<br>
 *
 * <b>Note:</b> <br>
 * (1) If API is called without topic, it will publish without topic. <br>
 * (2) Topic can be a single topic [String] or list of topic [String list]. <br>
 * (3) Topic name should be as path format. For example: home/livingroom/<br>
 * (4) Topic name can have letters [a-z, A-z], numerics [0-9] and special characters _ - . and /
 *
 * @param {EZMQEvent/EZMQByteData} message -Message to be published.
 * @param {string/stringlist} topic -Topic/s on which data needs to be published.
 *
 * @return {EZMQErrorCode} EZMQ_OK on success, otherwise appropriate error code.
 */
EZMQPublisher.prototype.publish = function(message, topic) {
    if (typeof topic === 'undefined') {
        if (message instanceof ezmqEvent.EZMQEvent) {
            return this.nezmqPub.publish(message.getAddonObj());
        } else if (message instanceof ezmqByteData.EZMQByteData) {
            return this.nezmqPub.publishByteData(message.getAddonObj());
        }
    }

    if (typeof topic === 'string') {
        if (message instanceof ezmqEvent.EZMQEvent) {
            return this.nezmqPub.publishOnTopic(topic, message.getAddonObj());
        } else if (message instanceof ezmqByteData.EZMQByteData) {
            return this.nezmqPub.publishByteDataOnTopic(
                topic,
                message.getAddonObj()
            );
        }
    } else {
        if (message instanceof ezmqEvent.EZMQEvent) {
            return this.nezmqPub.publishOnTopicList(
                topic,
                message.getAddonObj()
            );
        } else if (message instanceof ezmqByteData.EZMQByteData) {
            return this.nezmqPub.publishByteDataOnList(
                topic,
                message.getAddonObj()
            );
        }
    }
};

/**
 * Get the port of the publisher.
 *
 * @return {number} Port number.
 */
EZMQPublisher.prototype.getPort = function() {
    return this.nezmqPub.getPort();
};

/**
 * Stops PUB instance.
 *
 * @return {EZMQErrorCode} EZMQ_OK on success, otherwise appropriate error code.
 */
EZMQPublisher.prototype.stop = function() {
    return this.nezmqPub.stop();
};
