const MDNS = require("libp2p-mdns");
const PeerInfo = require("peer-info");
const multiaddr = require("multiaddr");

PeerInfo.create().then(p => {
  //  p.multiaddrs.add(multiaddr("/ip4/127.0.0.1/tcp/20001"));
  p.multiaddrs.add(multiaddr("/ip6/::/tcp/20001"));
  const mdns = new MDNS({
    peerInfo: p,
    interval: 500,
    broadcast: true,
    port: 5003
  });

  mdns.on("peer", peerInfo => {
    console.log("Found a peer in the local network", peerInfo.id.toB58String());
  });
  mdns.on("query", e => {
    console.log("query", e);
  });
  mdns.on("response", e => {
    console.log("response", e);
  });

  // Broadcast for 20 seconds
  mdns.start();
  mdns.peerInfo.multiaddrs.forEach(ma => console.log(ma.toString()));

  //setTimeout(() => mdns.stop(), 20 * 1000);
});
