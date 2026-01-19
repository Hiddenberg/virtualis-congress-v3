import Mux from "@mux/mux-node";

const MUX_TOKEN_ID = process.env.MUX_TOKEN_ID;
const MUX_TOKEN_SECRET = process.env.MUX_TOKEN_SECRET;

if (!MUX_TOKEN_ID || !MUX_TOKEN_SECRET) {
   throw new Error("Mux token not found");
}

const mux = new Mux({
   tokenId: MUX_TOKEN_ID,
   tokenSecret: MUX_TOKEN_SECRET,
});

export default mux;
