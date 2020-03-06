const libp2p = require("libp2p");
const kad = require("libp2p-kad-dht");
const MulticastDNS = require("libp2p-mdns");
const TCP = require("libp2p-tcp");
const websocket = require("libp2p-websockets");

libp2p.create({
  modules: {
    transport: [TCP],
    //    streamMuxer: [Mplex],
    //    connEncryption: [SECIO],
    peerDiscovery: [MulticastDNS]
  },
  config: {
    peerDiscovery: {
      mdns: {
        interval: 2,
        broadcast: true,
        enabled: true
      }
    }
  }
}).then(() => {
  node.on("peer:discovery", peer =>
    console.log("Discovered:", peer.id.toB58String())
  );
  await node.start();
  
})
