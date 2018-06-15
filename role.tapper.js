var roleTapper = {

    /** @param {Creep} creep **/
    run: function(creep,noLimits) {
        var homedex = Memory.rooms[creep.memory.home];

        if(noLimits[homedex].flags.length===0){
            creep.suicide();
            return;
        }


        var flag = noLimits[homedex].flags[0];
        var raum = flag.pos.roomName;
        
        creep.travelTo(flag);
        // tapp a room. make claim object, fill in energie arrays
        if (creep.room.name == raum){
            
            //add energy
            let sources = creep.room.find(FIND_SOURCES);
            for (let n=0;n<sources.length;n++){
                Memory.energie.quelle.push(sources[n].id);
                Memory.energie.raum.push(raum);
                Memory.energie.gov.push(creep.memory.home);
                Memory.energie.ordered.push(0);
                Memory.energie.distance.push(PathFinder.search(Game.getObjectById(Memory.claim[homedex].spawns[0]).pos,sources[n],{range: 1}).path.length);
                console.log('energy source found: ' + Memory.energie.quelle.length);
            }

            //add claim info
            Memory.claim[Memory.claim.length]={
                id: Game.rooms[raum].controller.id,
                room: raum,
                spawns: [],
                hostile: 0,
                rank: 0,
                parent: flag.memory.parent
            }
            delete Memory.flags[flag.name];
            flag.remove();










        }
    }
    
};

module.exports = roleTapper;