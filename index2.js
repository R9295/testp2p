const MDNS = require("libp2p-mdns");

const mdns = new MDNS(options);

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
//setTimeout(() => mdns.stop(), 20 * 1000);
