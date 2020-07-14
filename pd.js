/* eslint-disable no-console */
"use strict";

const PeerId = require("peer-id");
const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");
const Mplex = require("libp2p-mplex");
const SECIO = require("libp2p-secio");
const MulticastDNS = require("libp2p-mdns");
const WS = require("libp2p-websockets");
const Bootstrap = require("libp2p-bootstrap");

const createNode = async () => {
  const peerId = await PeerId.createFromJSON(require("./id-d.json"));
  const node = await Libp2p.create({
    peerId: peerId,
    addresses: {
      listen: ["/ip6/::/tcp/5000", "/ip6/::/tcp/60001/ws"]
    },
    modules: {
      transport: [TCP, WS],
      streamMuxer: [Mplex],
      connEncryption: [SECIO],
      peerDiscovery: [Bootstrap]
    },
    config: {
      peerDiscovery: {
        bootstrap: {
          interval: 1000,
          enabled: true,
          list: [
            "/ip6/fe80::ba27:ebff:fecd:680b/tcp/60001/p2p/QmcrQZ6RJdpYuGvZqD5QEHAv6qX4BrQLJLQPQUrTrzdcgm"
          ]
        }
      }
    }
  });

  return node;
};

(async () => {
  const node1 = await createNode();

  node1.on("peer:discovery", peer =>
    console.log("Discovered:", peer.id.toB58String())
  );
  node1.connectionManager.on("connected", connection => {
    console.log(
      "Connection established to:",
      connection.remotePeer.toB58String()
    ); // Emitted when a new connection has been created
  });
  await node1.start();
  console.log(node1);
})();
