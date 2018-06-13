var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var index = Memory.claim.findIndex((claim) => claim.id === creep.memory.sourceId);
        var contr = Game.getObjectById(creep.memory.sourceId);
        var raum = Memory.claim[index].room;
        
        // get some more use out of this guy after claiming a room.
        
        if(contr){if(Game.rooms[raum].controller.level > 0){
            for(let n = 0; n < Memory.claim.length ; n++){
                if(Memory.claim[n].rank == 0){creep.memory.sourceId = Memory.claim[n].id;break;}
            }
            var index = Memory.claim.findIndex((claim) => claim.id === creep.memory.sourceId);
            var contr = Game.getObjectById(creep.memory.sourceId);
            var raum = Memory.claim[index].room;
        }}

        // reserve a room. claim if necessary
        if (creep.room.name == raum){
            if(creep.pos.isNearTo(contr)){
                if(Memory.claim[index].rank == 0){creep.reserveController(contr);}
                else if(Memory.claim[index].rank == 1){creep.claimController(contr);}
            }else{
            creep.moveTo(contr);
            }
        }
        else if(Game.rooms[raum]){
            creep.moveTo(contr);
        }
        else{
            creep.moveTo(creep.pos.findClosestByPath(creep.room.findExitTo(raum)));
        }
    }
    
};

module.exports = roleClaimer;