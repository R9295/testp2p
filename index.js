const libp2p = require("libp2p");
const kad = require("libp2p-kad-dht");
const MulticastDNS = require("libp2p-mdns");
const TCP = require("libp2p-tcp");
const websocket = require("libp2p-websockets");
const PeerInfo = require("peer-info");
const multiaddr = require("multiaddr");
const Gossipsub = require("libp2p-gossipsub");

PeerInfo.create().then(p => {
  p.multiaddrs.add(multiaddr("/ip4/127.0.0.1/tcp/20002"));
  libp2p
    .create({
      peerInfo: p,
      modules: {
        transport: [TCP],
        pubsub: Gossipsub,
        //    streamMuxer: [Mplex],
        //    connEncryption: [SECIO],
        peerDiscovery: [MulticastDNS]
      },
      config: {
        peerDiscovery: {
          autodial: true,
          [MulticastDNS.tag]: {
            broadcast: true,
            interval: 1000,
            enabled: true,
            port: 5003
          },
          pubsub: {
            enabled: true,
            // dont process for messages that this node sends
            emitSelf: false
          },
        }
      }
    })
    .then(async node => {
      node.on("peer:discovery", peer =>
        console.log("Discovered:", peer.id.toB58String())
      );
      setInterval(() => {
        console.log(node.peerStore.peers)
      }, 2000)
      await node.start();
    });
});
