// LGD = Loss Given Default --> if the company does default, how much of your money do you actually lose.
// LGD = 1 - recoveryRate

export function getLGD(data){
    let recoveryRate = 0 ;
    if(data.securityType === 'Secured')
        recoveryRate += 0.65
    else if(data.securityType === 'Partially Secured')
        recoveryRate += 0.45
    else if(data.securityType === 'Unsecured')
        recoveryRate += 0.25
    else if(data.securityType === 'Not sure')
        recoveryRate += 0.40

    if(data.instrumentType === 'Secured NCD')
        recoveryRate += 0.05
    else if(data.instrumentType === 'MLD')
        recoveryRate -= 0.1
    else if(data.instrumentType === 'Unsecured NCD' || data.instrumentType === 'Not sure')
        recoveryRate += 0

    recoveryRate = Math.min(0.85, recoveryRate) 
    return 1 - recoveryRate    
}
