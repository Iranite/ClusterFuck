var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep,carrier) {
        var conspa = require('config.spawns');
        var source = Game.getObjectById(creep.memory.sourceId);
        var index = Memory.energie.quelle.indexOf(creep.memory.sourceId);
        var raum = Memory.energie.raum[index];
        let homedex = Memory.rooms[creep.memory.home];
        let spawn = Game.getObjectById(Memory.claim[homedex].spawns[0]);
        var position = obj => new RoomPosition(obj.x, obj.y, obj.roomName);
        if(Memory.energie.position[index]){var dest = Memory.energie.position[index];}
        //else{var dest = source;}
        
        
        
        
    // Spawn fresh Harvester once this one has ticksToLive == Traveltime+Spawntime.
        if(creep.ticksToLive < Memory.energie.distance[index]+creep.body.length*3 && !creep.memory.dying){
            creep.say('I\'m tired',true);
            for(let m = 0;m<Memory.claim[homedex].spawns.length;m++){
                spawn = Game.getObjectById(Memory.claim[homedex].spawns[m])
                if(!spawn.spawning){break;}  
            }
            //check to see if spawner is available first
            if(spawn.spawnCreep(conspa.spwnHar(Game.rooms[creep.memory.home].energyCapacityAvailable, index), Game.time, {memory: {role: 'harvester', sourceId: creep.memory.sourceId, home: Memory.energie.gov[index]},  dryRun: true }) == 0 ){
                spawn.spawnCreep(conspa.spwnHar(Game.rooms[creep.memory.home].energyCapacityAvailable, index), 'Har'+conspa.morsch(), {memory: {role: 'harvester', sourceId: creep.memory.sourceId, home: Memory.energie.gov[index]}});
                creep.memory.dying = true;
                console.log('Spawning new harvester');
            }
        }
        else if(creep.memory.dying){
            creep.say('Soon...',true);
        }
        

        
        
    // Moving to target room whatsoever :(()
    
        if(creep.carry.energy < creep.carryCapacity||carrier) {
            if(raum == Memory.claim[homedex].AlarmRoom&&raum!=creep.memory.home){
                creep.travelTo(creep.home.controller);
                creep.say('Yikes!!!',true);
            }
            else if (creep.room.name == raum){
                if(!dest){
                    if(creep.harvest(source) == 0){
                        Memory.energie.position[index] = creep.pos;
                    }
                    else{
                        creep.travelTo(source);
                    }
                }
                else if(JSON.stringify(creep.pos)==JSON.stringify(dest)) {
                    if(Memory.energie.conti[index]){
                        let conti = Game.getObjectById(Memory.energie.conti[index])
                        if(conti){
                            if(conti.hitsMax-conti.hits > creep.getActiveBodyparts(WORK)*100 && creep.carry.energy > creep.getActiveBodyparts(WORK)){
                                creep.repair(conti);
                            }
                        }
                        else{Memory.energie.conti[index] = 0}
                    }
                    creep.harvest(source);
                }
                else if(dest){
                    creep.travelTo(position(dest));
                }
                else{console.log('harvester broken');}
            }
            else if(Game.rooms[raum]){
                creep.travelTo(source);
            }
            else{
                creep.travelTo(creep.pos.findClosestByPath(creep.room.findExitTo(raum)));
            }
        }
    // no carriers, by death or respawn => harvester will have to haul himself.
        else if(!carrier) {
            var targets = spawn.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                                structure.structureType == STRUCTURE_SPAWN) &&
                                structure.energy < structure.energyCapacity;}});
            if(targets.length > 0){
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(targets[0]);
                }
            }
        }
	}
};

module.exports = roleHarvester;