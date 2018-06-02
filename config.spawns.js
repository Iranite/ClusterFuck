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
// Building the base    
    buildExtis: function(extis){
    //convert power to extis
    extis = (extis-300)/50;
    if(Game.spawns.tuis.room.controller.level>=2){
    switch(extis){
        case 0: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+1,Game.spawns.tuis.pos.y-1,STRUCTURE_EXTENSION); break;
        case 1: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+1,Game.spawns.tuis.pos.y+1,STRUCTURE_EXTENSION); break;
        case 2: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-1,Game.spawns.tuis.pos.y+1,STRUCTURE_EXTENSION); break;
        case 3: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-1,Game.spawns.tuis.pos.y-1,STRUCTURE_EXTENSION); break;
        case 4: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-2,Game.spawns.tuis.pos.y+1,STRUCTURE_EXTENSION); break;
        
        case 5: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x,Game.spawns.tuis.pos.y-3,STRUCTURE_CONTAINER);
                Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-2,Game.spawns.tuis.pos.y-1,STRUCTURE_EXTENSION); break;
        case 6: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-1,Game.spawns.tuis.pos.y-2,STRUCTURE_EXTENSION); break;
        case 7: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-1,Game.spawns.tuis.pos.y+2,STRUCTURE_EXTENSION); break;
        case 8: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+1,Game.spawns.tuis.pos.y-2,STRUCTURE_EXTENSION); break;
        case 9: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+2,Game.spawns.tuis.pos.y-1,STRUCTURE_EXTENSION); break;
        
        case 10: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+2,Game.spawns.tuis.pos.y+1,STRUCTURE_EXTENSION); break;
        case 11: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+1,Game.spawns.tuis.pos.y+2,STRUCTURE_EXTENSION); break;
        case 12: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+3,Game.spawns.tuis.pos.y-2,STRUCTURE_EXTENSION); break;
        case 13: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+2,Game.spawns.tuis.pos.y-3,STRUCTURE_EXTENSION); break;
        case 14: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+3,Game.spawns.tuis.pos.y-3,STRUCTURE_EXTENSION); break;
        
        case 15: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+4,Game.spawns.tuis.pos.y-3,STRUCTURE_EXTENSION); break;
        case 16: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+3,Game.spawns.tuis.pos.y-4,STRUCTURE_EXTENSION); break;
        case 17: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+2,Game.spawns.tuis.pos.y+3,STRUCTURE_EXTENSION); break;
        case 18: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+3,Game.spawns.tuis.pos.y+2,STRUCTURE_EXTENSION); break;
        case 19: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+3,Game.spawns.tuis.pos.y+3,STRUCTURE_EXTENSION); break;
        
        case 20: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-3,Game.spawns.tuis.pos.y+2,STRUCTURE_EXTENSION); break;
        case 21: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-3,Game.spawns.tuis.pos.y+3,STRUCTURE_EXTENSION); break;
        case 22: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-2,Game.spawns.tuis.pos.y+3,STRUCTURE_EXTENSION); break;
        case 23: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x+4,Game.spawns.tuis.pos.y+3,STRUCTURE_EXTENSION); break;
        case 24: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-4,Game.spawns.tuis.pos.y+3,STRUCTURE_EXTENSION); break;
        
        case 25: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-3,Game.spawns.tuis.pos.y-3,STRUCTURE_EXTENSION); break;
        case 26: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-3,Game.spawns.tuis.pos.y-4,STRUCTURE_EXTENSION); break;
        case 27: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-4,Game.spawns.tuis.pos.y-3,STRUCTURE_EXTENSION); break;
        case 28: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-2,Game.spawns.tuis.pos.y-3,STRUCTURE_EXTENSION); break;
        case 29: Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-3,Game.spawns.tuis.pos.y-2,STRUCTURE_EXTENSION); break;
        default:
    }}
        if(Game.spawns.tuis.room.controller.level>2){
            Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x-3,Game.spawns.tuis.pos.y,STRUCTURE_TOWER);
        }
        if(Game.spawns.tuis.room.controller.level>3){
            Game.spawns.tuis.room.createConstructionSite(Game.spawns.tuis.pos.x,Game.spawns.tuis.pos.y+3,STRUCTURE_STORAGE);
        }
    },
// configuring the creeps    
    spwnHar: function(extis) {
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
        default: return  [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE]; //800 - 10
        }
    },
    spwnUpg: function(extis) {
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
            for(let n = 1; n< Math.ceil(carries/2);n++){
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