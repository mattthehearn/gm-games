// @flow

// Translate team.depth from pids to player objects, while validating that it contains all players on the team (supplied by `players`) and no extraneous players.
const getDepthPlayers = <
    T: {
        pid: number,
    },
>(
    depth: {
        GK: number[],
        DEF: number[],
        MID: number[],
        FWD: number[],
    },
    players: T[],
): {
    GK: T[],
    DEF: T[],
    MID: T[],
    FWD: T[],
} => {
    // $FlowFixMe
    return Object.keys(depth).reduce((obj, pos) => {
        obj[pos] = depth[pos]
            .map(pid => players.find(p => p.pid === pid))
            .concat(
                // $FlowFixMe
                players.map(p => (depth[pos].includes(p.pid) ? undefined : p)),
            )
            .filter(p => p !== undefined);
        return obj;
    }, {});
};

export default getDepthPlayers;
