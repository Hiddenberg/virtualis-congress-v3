type LivestreamSessionStatus =
   | "scheduled"
   | "preparing"
   | "streaming"
   | "paused"
   | "ended";
interface LivestreamSession {
   organization: OrganizationRecord["id"];
   status: LivestreamSessionStatus;
   attendantStatus: LivestreamSessionStatus;
}
type LivestreamSessionRecord = LivestreamSession & DBRecord;

interface LivestreamMuxLivestream {
   organization: OrganizationRecord["id"];
   livestreamSession: LivestreamSessionRecord["id"];
   muxLivestreamId: string;
   streamKey: string;
   livestreamPlaybackId: string;
}
type LivestreamMuxAssetRecord = LivestreamMuxLivestream & DBRecord;
