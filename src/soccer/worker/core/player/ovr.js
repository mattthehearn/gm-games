// @flow

import { helpers } from "../../../../deion/worker/util";
import type { PlayerRatings } from "../../../common/types";

const info = {
    GK: {
        hgt: [1, 1],
        spd: [1, 1],
        endu: [1, 1],
        thv: [8, 1.5],
        thp: [4, 1.5],
        tha: [8, 1.5],
        bsc: [1, 1],
        elu: [1, 1],
    },
    DEF: {
        stre: [4, 1],
        spd: [8, 1],
        endu: [1, 1],
        elu: [8, 2],
        rtr: [1, 1],
        hnd: [2, 1],
        bsc: [4, 1],
        rbk: [1, 1],
        pbk: [2, 1],
    },
    MID: {
        hgt: [2, 1],
        stre: [1, 1],
        spd: [4, 2],
        endu: [1, 1],
        elu: [1, 1],
        rtr: [4, 1],
        hnd: [8, 1],
        bsc: [1, 1],
        rbk: [1, 1],
    },
    FWD: {
        hgt: [4, 1],
        stre: [4, 2],
        spd: [1, 1],
        endu: [1, 1],
        elu: [1, 1],
        rtr: [4, 1],
        hnd: [4, 1],
        bsc: [1, 1],
        rbk: [2, 1],
    },
};

// Handle some nonlinear interactions
const bonuses = {
    MID: ratings => helpers.bound((ratings.spd * ratings.elu) / 300, 6, 20),
};

const ovr = (ratings: PlayerRatings, pos?: string): number => {
    pos = pos !== undefined ? pos : ratings.pos;

    let r = 0;

    if (info[pos]) {
        let sumCoeffs = 0;
        // $FlowFixMe
        for (const [key, [coeff, power]] of Object.entries(info[pos])) {
            const powerFactor = 100 / 100 ** power;
            r += coeff * powerFactor * ratings[key] ** power;
            sumCoeffs += coeff;
        }
        r /= sumCoeffs;

        if (bonuses.hasOwnProperty(pos)) {
            // $FlowFixMe
            r += bonuses[pos](ratings);
        }
    } else {
        throw new Error(`Unknown position: "${pos}"`);
    }

    // Fudge factor to keep ovr ratings the same as they used to be (back before 2018 ratings rescaling)
    // +8 at 68
    // +4 at 50
    // -5 at 42
    // -10 at 31
    let fudgeFactor = 0;
    if (r >= 68) {
        fudgeFactor = 8;
    } else if (r >= 50) {
        fudgeFactor = 4 + (r - 50) * (4 / 18);
    } else if (r >= 42) {
        fudgeFactor = -5 + (r - 42) * (10 / 8);
    } else if (r >= 31) {
        fudgeFactor = -5 - (42 - r) * (5 / 11);
    } else {
        fudgeFactor = -10;
    }

    r = helpers.bound(Math.round(r + fudgeFactor), 0, 100);

    // Feels silly that the highest rated players are kickers and punters
    if (pos === "K" || pos === "P") {
        r = Math.round(r * 0.75);
    }

    // QB should never be KR/PR
    if (ratings.pos === "QB" && (pos === "KR" || pos === "PR")) {
        r = Math.round(r * 0.5);
    }

    return r;
};

export default ovr;
