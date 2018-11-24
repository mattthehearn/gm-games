// @flow

import { idb } from "..";
import type { Player, PlayerFiltered } from "../../../common/types";
import type { PlayerRatings } from "../../../../basketball/common/types";
import type { PlayerOptions } from "../../../../basketball/worker/db/getCopies/playersPlus";

// async is only for API consistency, it's not actually needed now that stats are in player objects
const getCopy = async (
    p: Player<PlayerRatings>,
    options: PlayerOptions,
): Promise<PlayerFiltered | void> => {
    const result = await idb.getCopies.playersPlus([p], options);
    return result[0];
};

export default getCopy;