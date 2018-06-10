module.exports = {
// use a ticking number, reversed and converted to a base 26 - alphabetical code to make unique creep names.
    morsch: function(){
        Memory.init.number++;
        // for cjk: base20992, +19968 for ABC: base26, +65
        var number= String(Game.time).split('').reverse().join('');
        var base = 20992;
        var c='';
        var m = base;
        for (var n = 0; m>=base ;n++){
            m = Math.floor(number/Math.pow(base,n));
            c +=(String.fromCharCode(m%base+19968));
        }
        return c
        
    // old code
        //return String.fromCharCode(Math.ceil(Math.random()*26+64))+Memory.init.number+String.fromCharCode(Math.ceil(Math.random()*26+64));
        console.log('oops');
    },
// configuring the creeps    
    spwnHar: function(extis,index) {
    //convert power to extis
    extis = (extis-300)/50;
        switch(extis){
        case 0: return  [WORK,WORK,CARRY,MOVE]; //250 - 0
                break;
        case 1:
        case 2:
        case 3:
        case 4: return  [WORK,WORK,CARRY,MOVE,MOVE]; //350 - 1
                break;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9: return  [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]; //500 - 4
                break;
        case 10:
        case 11: 
        case 12:
        case 13:
        case 14: return [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]; // 650 - 7
                break;
        default: {
            if(Memory.energie.conti[index]&&Memory.claim[Memory.rooms[Memory.energie.raum[index]]].rank === 0){
                return  [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]; //800 - 10
            }
            else{
                return  [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]; //700 - 8
            }
            }
        }
    },
    spwnUpg: function(extis,roomdex) {

    //convert roomdex to RCL
    let RCL = Game.getObjectById(Memory.claim[roomdex].id).level;
    let W=Math.min(Math.max(Math.floor(extis/150),1),27);
    if(RCL == 8){
        W=Math.min(Math.max(Math.floor(Game.rooms[Memory.claim[roomdex].room].storage.store.energy/10000),1),15)
    }
    let C = Math.ceil(W/3);
    let M = Math.ceil(W/2);
    let repurn = [];
    for(let n=0;n<W;n++){
        repurn = repurn.concat([WORK]);
    }
    for(let n=0;n<C;n++){
        repurn = repurn.concat([CARRY]);
    }
    for(let n=0;n<M;n++){
        repurn = repurn.concat([MOVE]);
    }
    //console.log(`RCL:${RCL} W${W} C${C} M${M} and ${repurn.length} in ${repurn}`);
    return repurn;
    

/*
this
    n = Math.max(Math.floor(extis/150),1)               W C M
    1     WCM                           200             1 1 1 
    2     WWCM                          300             2 1 1
    3     WWWCMM                        450             3 1 2
    4     WWWWCCMM                      600             4 2 2
    5     WWWWWCCMMM                    750             5 2 3
    6     WWWWWWCCMMM                   850             6 2 3
    7     WWWWWWWCCCMMMM               1050             7 3 4
    8     WWWWWWWWCCCMMMM              1150
    9     WWWWWWWWWCCCMMMMM            1300
    10    WWWWWWWWWWCCCCMMMMM          1450
    12    WWWWWWWWWWWWCCCCMMMMMM       1700
    15    WWWWWWWWWWWWWWWCCCCCMMMMMMMM 2150            15 5 8 


*/

        //convert power to extis
        extis = (extis-300)/50;
        switch(extis){
        case 0:
        case 1:
        case 2: return  [WORK,WORK,CARRY,MOVE]; // 0
                break;
        case 3:
        case 4: 
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11: return  [WORK,WORK,WORK,CARRY,MOVE,MOVE]; // 3
                break;
        case 12:
        case 13:
        case 14:
        case 15:
        case 16:
        case 17:
        case 18:
        case 19:
        case 20: return [WORK,WORK,WORK,CARRY,MOVE,MOVE,WORK,WORK,WORK,CARRY,MOVE,MOVE]; //12
                 break;
        case 21:
        case 22: 
        case 23:
        case 24:
        case 25:
        case 26:
        case 27:
        case 28:
        case 29: return [WORK,WORK,WORK,CARRY,MOVE,MOVE,WORK,WORK,WORK,CARRY,MOVE,MOVE,WORK,WORK,WORK,CARRY,MOVE,MOVE]; //21
                 break;
        case 30: 
        case 31:
        case 32:
        case 33:
        case 34:
        case 35:
        case 36:
        case 37:
        case 38: return [WORK,WORK,WORK,CARRY,MOVE,MOVE,WORK,WORK,WORK,CARRY,MOVE,MOVE,WORK,WORK,WORK,CARRY,MOVE,MOVE,WORK,WORK,WORK,CARRY,MOVE,MOVE]; //30
                 break;
        default: return [WORK,WORK,WORK,CARRY,MOVE,MOVE,WORK,WORK,WORK,CARRY,MOVE,MOVE,WORK,WORK,WORK,CARRY,MOVE,MOVE,WORK,WORK,WORK,CARRY,MOVE,MOVE,WORK,WORK,WORK,CARRY,MOVE,MOVE]; //39
        }
    },
    spwnBui: function(extis) {
    //convert power to extis
    extis = (extis-300)/50;
        switch(extis){
        case 0: return [WORK,WORK,CARRY,MOVE]; // 0
                break;
        case 1: return [WORK,WORK,CARRY,MOVE,MOVE]; // 1
                break;
        case 2:
        case 3:
        case 4: return [WORK,WORK,CARRY,CARRY,MOVE,MOVE] //2
                break;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10: return [WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE] // 5
                 break;
        case 11:
        case 12:
        case 13:
        case 14:
        case 15: return  [WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE]; //11
                 break;
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
        default: return [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]; //16
        //         break;
        //default: return [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]; //22 
        }
    },
    //[CARRY,MOVE]*(3+Math.floor(extis/2));
    spwnCar: function(carries,road) {
        /**
        if(road){
            var leiste = [CARRY,CARRY,MOVE];
            var inhalt = leiste;
            for(let n = 1; n<2+Math.floor(extis/3);n++){
                leiste = leiste.concat(inhalt);
            }
            
        }
        else{
            var leiste = [CARRY,MOVE];
            var inhalt = leiste;
            for(let n = 1;n < 3+Math.floor(extis/2);n++){
                leiste = leiste.concat(inhalt);
            }
        }
        return leiste;
        if(false){ // test code get required nummber of CARRY and boolean road
        **/
        if(road){
            var leiste = [CARRY,CARRY,MOVE];
            var inhalt = leiste;
            for(let n = 1; n< Math.floor(carries/2);n++){
                leiste = leiste.concat(inhalt);
            }
            
        }
        else{
            var leiste = [CARRY,MOVE];
            var inhalt = leiste;
            for(let n = 1;n < carries;n++){
                leiste = leiste.concat(inhalt);
            }
        }
        //console.log(carries+':'+leiste)
        return leiste;
            
        //}
    },
    spwnBum: function(extis){
    //convert power to extis
    extis = (extis-300)/50;
        switch(extis){
        case 0:
        case 1:
        case 2:
        case 3: return[MOVE,MOVE,ATTACK,ATTACK] //260 - 0
        case 4:
        case 5:
        case 6: return [MOVE,MOVE,RANGED_ATTACK,HEAL]; //500 - 4
                break;
        case 7:
        case 8: return [MOVE,MOVE,MOVE,ATTACK,RANGED_ATTACK,HEAL]; //630 - 7
                break;
        default: return [TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,RANGED_ATTACK,HEAL]; //750 - 9
        
        }
        
        
    }
    
};