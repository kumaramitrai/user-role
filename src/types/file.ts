/** File metadata type declaration. */
type Metadata = {
    key: string;
    value: unknown;
};

/** Pin status of the file. */
type PinStatus =
    | 'queued'
    | 'pin_queued'
    | 'pinning'
    | 'pinned'
    | 'unpin_queued'
    | 'unpinning'
    | 'unpinned'
    | 'unexpected_unpinned'
    | 'cluster_error'
    | 'pin_error'
    | 'unpin_error'
    | 'failed'
    | 'remote';

/** Type declaration for Peer of peer_map object while checking status through IPFS cluster. */
type ClusterPeer = {
    clusterPeerID?: string;
    clusterPeerName?: string;
    ipfsPeerID: string;
    status: PinStatus;
    attemptCount?: number;
};

export { Metadata, PinStatus, ClusterPeer };
