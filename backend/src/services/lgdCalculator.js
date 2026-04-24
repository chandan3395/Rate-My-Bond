// LGD = Loss Given Default --> if the company does default, how much of your money do you actually lose.
// LGD = 1 - recoveryRate

import { LGD_INSTRUMENT_ADJUST, LGD_RECOVERY_BASE } from "../modelConfig.js";

export function getLGD(data) {
  let recoveryRate = LGD_RECOVERY_BASE[data.securityType] ?? 0;
  recoveryRate += LGD_INSTRUMENT_ADJUST[data.instrumentType] ?? 0;

  recoveryRate = Math.min(0.85, recoveryRate);
  return 1 - recoveryRate;
}
