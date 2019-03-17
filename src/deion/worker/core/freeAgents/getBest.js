// @flow

import { team } from "..";
import { g } from "../../util";
import type { Player } from "../../../common/types";

// Find the best available free agent for a team.
// playersAvailable should be sorted - best players first, worst players last. It will be mutated if a player is found, to remove the found player.
// If payroll is not supplied, don't do salary cap check (like when creating new league).
const getBest = (
    playersOnRoster: Player<>[],
    playersAvailable: Player<>[],
    payroll?: number,
) => {
    const neededPositions = team.getNeededPositions(playersOnRoster);
    console.log(neededPositions, playersAvailable.length);
    const useNeededPositions = Math.random() < 0.9;

    for (let i = 0; i < playersAvailable.length; i++) {
        const p = playersAvailable[i];

        // Skip players if team already has enough at this position
        if (neededPositions.size > 0 && useNeededPositions) {
            const pos = p.ratings[p.ratings.length - 1].pos;
            if (!neededPositions.has(pos)) {
                continue;
            }
        }

        const salaryCapCheck =
            payroll === undefined || p.contract.amount + payroll <= g.salaryCap;
        console.log(
            p,
            salaryCapCheck,
            salaryCapCheck ||
                (p.contract.amount <= g.minContract &&
                    playersOnRoster.length < g.maxRosterSize - 2),
        );

        // Don't sign minimum contract players to fill out the roster
        if (
            salaryCapCheck ||
            (p.contract.amount <= g.minContract &&
                playersOnRoster.length < g.maxRosterSize - 2)
        ) {
            playersAvailable.splice(i, 1); // Remove from list of free agents
            return p;
        }
    }
};

export default getBest;
