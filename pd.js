/* eslint-disable no-console */
"use strict";

const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");
const Mplex = require("libp2p-mplex");
const SECIO = require("libp2p-secio");
const MulticastDNS = require("libp2p-mdns");

const createNode = async () => {
  const node = await Libp2p.create({
    modules: {
      transport: [TCP],
      streamMuxer: [Mplex],
      connEncryption: [SECIO],
      peerDiscovery: [MulticastDNS]
    },
    config: {
      peerDiscovery: {
        mdns: {
          interval: 1000,
          enabled: true
        }
      }
    }
  });
  node.peerInfo.multiaddrs.add("/ip4/0.0.0.0/tcp/0");

  return node;
};

(async () => {
  const node1 = await createNode();

  node1.on("peer:discovery", peer =>
    console.log("Discovered:", peer.id.toB58String())
  );
  await node1.start();
  node1.peerInfo.multiaddrs.forEach(ma => console.log(ma.toString()));
})();
