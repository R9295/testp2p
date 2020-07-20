/* eslint-disable no-console */
"use strict";

const Libp2p = require("libp2p");
const wrtc = require("wrtc");
const TCP = require("libp2p-tcp");
const Mplex = require("libp2p-mplex");
const SECIO = require("libp2p-secio");
const Bootstrap = require("libp2p-bootstrap");
const WStar = require("libp2p-webrtc-star");
const WS = require("libp2p-websockets");
const PeerId = require("peer-id");
// Find this list at: https://github.com/ipfs/js-ipfs/blob/master/src/core/runtime/config-nodejs.json
const bootstrapers = [
  "/ip6/fe80::ba27:ebff:fecd:680b%wlp2s0/tcp/5001/p2p/QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm"
  //"/ip4/169.254.214.252/tcp/5000/p2p/QmZgJ1LXGdsyCGXASeduo11ao9qB3WjKzgULDFgr9c5rYC"
];
WStar.upgrader = {
  upgradeOutBound: maConn => maConn,
  upgradeInBound: maConn => maConn
};
(async () => {
  const id = await PeerId.createFromJSON(require("./id-d.json"));
  const node = await Libp2p.create({
    peerId: id,
    addresses: {
      listen: ["/ip6/::/tcp/5001", "/ip4/0.0.0.0/tcp/13579/ws/p2p-webrtc-star"]
    },
    modules: {
      transport: [TCP, WS, WStar],
      streamMuxer: [Mplex],
      connEncryption: [SECIO]
      //  peerDiscovery: [Bootstrap]
    }
    // config: {
    //   // [WStar.tag]: {
    //   //   enabled: true
    //   // }
    //   //   peerDiscovery: {
    //   //     // bootstrap: {
    //   //     //   interval: 60e3,
    //   //     //   enabled: true,
    //   //     //   list: bootstrapers
    //   //     // },
    //   //     relay: {
    //   //       // Circuit Relay options (this config is part of libp2p core configurations)
    //   //       enabled: true, // Allows you to dial and accept relayed connections. Does not make you a relay.
    //   //       hop: {
    //   //         enabled: true, // Allows you to be a relay for other peers
    //   //         active: true // You will attempt to dial destination peers if you are not connected to them
    //   //       }
    //   //     }
    //   //   }
    // }
  });

  node.connectionManager.on("peer:connect", connection => {
    console.log(
      "Connection established to:",
      connection.remotePeer.toB58String()
    ); // Emitted when a peer has been found
  });

  node.on("peer:discovery", peerId => {
    // No need to dial, autoDial is on
    console.log("Discovered:", peerId.toB58String());
  });

  await node.start();
  node.multiaddrs.forEach(ma =>
    console.log(`${ma.toString()}/p2p/${node.peerId.toB58String()}`)
  );
  setInterval(() => {
    node.connectionManager.connections.forEach(item => {
      console.log(`item remote addr: ${item[0].remoteAddr.toString()}`);
      console.log(`item local addr: ${item[0].localAddr.toString()}`);
    });
  }, 5000);
})();
