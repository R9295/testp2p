const libp2p = require("libp2p");
const kad = require("libp2p-kad-dht");
const MulticastDNS = require("libp2p-mdns");
const TCP = require("libp2p-tcp");
const websocket = require("libp2p-websockets");
const PeerInfo = require("peer-info");

PeerInfo.create().then(p => {
  p.multiaddrs.add(multiaddr("/ip4/127.0.0.1/tcp/20001"));
  libp2p
    .create({
      modules: {
        transport: [TCP],
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
          }
        }
      }
    })
    .then(async () => {
      node.on("peer:discovery", peer =>
        console.log("Discovered:", peer.id.toB58String())
      );
      await node.start();
    });
});
