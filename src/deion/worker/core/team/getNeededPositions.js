// @flow

import { overrides } from "../../util";
import type { Player } from "../../../common/types";

const getNeededPositions = (players: Player<>[]) => {
    const neededPositions = new Set();

    if (Object.keys(overrides.common.constants.POSITION_COUNTS).length === 0) {
        return neededPositions;
    }

    const counts = {
        ...overrides.common.constants.POSITION_COUNTS,
    };

    for (const p of players) {
        const pos = p.ratings[p.ratings.length - 1].pos;

        if (counts.hasOwnProperty(pos)) {
            counts[pos] -= 1;
        }
    }

    for (const [pos, numNeeded] of Object.entries(counts)) {
        // $FlowFixMe
        if (numNeeded > 0) {
            neededPositions.add(pos);
        }
    }

    return neededPositions;
};

export default getNeededPositions;
