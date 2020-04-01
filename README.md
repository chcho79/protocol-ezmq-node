# ezmq library (node.js)

protocol-ezmq-node is nodejs binding over [protocol-ezmq-cpp](https://github.com/edgexfoundry-holding/protocol-ezmq-cpp), that provides a standard messaging interface over various data streaming
and serialization / deserialization middlewares along with some added functionalities.</br>
  - Currently supports streaming using 0mq and serialization / deserialization using protobuf.
  - Publisher -> Multiple Subscribers broadcasting.
  - Topic based subscription and data routing at source (read publisher).
  - High speed serialization and deserialization.

## Prerequisites ##

- nodejs
  - Version : 8.9.4 [[Node js Download link](https://nodejs.org/en/download/)]

- npm
  - Version : 5.6.0
  
- You must install **libsodium**:
   ```
   $ sudo apt-get install libsodium-dev 
   ```
  
## How to build ##
1. Goto: ~/protocol-ezmq-node/
2. Following are the scripts for building ezmq library:</br>
   **(a) build.sh**      : Build for linux x86_64 with dependencies</br>
   **(b) build_auto.sh** : Generic script</br>

**Note:** </br>
(a) For getting help about script [ build_auto.sh ] : **$ ./build_auto.sh --help** </br>

## How to run ##

### Prerequisites ###
 Built protocol-ezmq-node.
 
 ### Subscriber sample ###
1. Goto: ~/protocol-ezmq-node/samples/
2. Run the sample:
    ```
    node subscriber.js
    ```
    - **It will give list of options for running the sample.** </br>
    - **Update ip, port and topic as per requirement.** </br>

### Publisher sample ###
1. Goto: ~/protocol-ezmq-node/samples/
2. Run the sample:
   ```
   node publisher.js
   ```
   - **It will give list of options for running the sample.** </br>
   - **Update port and topic as per requirement.** </br>
   
## Running unit test cases ##

### Prerequisites ###
 Built protocol-ezmq-node in secured mode.
 
### Unit test ### 
1. Goto: ~/protocol-ezmq-node/
2. Run the test cases:
   ```
   $ node_modules/mocha/bin/mocha unittests/*js
   ```    

## Future Work ##
  - High speed parallel ordered serialization / deserialization based on streaming load.
  - Threadpool for multi-subscriber handling.
  - Router pattern. For number of subscribers to single publisher use case.
  - Clustering Support.
</br></br>
