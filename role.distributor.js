var roleDistributor = {

    /** @param {Creep} creep **/
    run: function(creep,noLimits){
        let homedex = Memory.claim.findIndex(claim => claim.room === creep.memory.home);
        let spawn = Game.getObjectById(Memory.claim[homedex].spawns[0]);
        let speicher = creep.home.storage;
        let drops = noLimits[homedex].drops;
        let targets = noLimits[homedex].energyNeed;
        // renew this creep when possible
        if(creep.pos.isNearTo(spawn)&&creep.ticksToLive < 1400){
            if(spawn.renewCreep(creep) == 0){
                creep.say('Yeaah!',true);
            }
        }
        
        // find tombstones
        if(!drops.length){
            var tombstones = spawn.pos.findInRange(FIND_TOMBSTONES,5, {
                        filter: (structure) => {
                        return structure.store.energy > 0 ;
                        }});
            var tombstone = spawn.pos.findClosestByRange(tombstones);
        }
        
        //toggle work
        if(creep.memory.werk && creep.carry.energy == 0) {
            creep.memory.werk = false;
	    }
	    if(!creep.memory.werk && (creep.carry.energy == creep.carryCapacity || (drops.length == 0 && !speicher))) {
	        creep.memory.werk = true;
	    }
        
        //work
        if (creep.memory.werk){
            if(targets.length > 0){
                var target =creep.pos.findClosestByRange(targets);
                creep.moveTo(target);
                if(creep.withdraw(speicher,RESOURCE_ENERGY) == 0){creep.say('sneaky',true);}
                creep.transfer(target, RESOURCE_ENERGY);
            }
            else{
                creep.moveTo(spawn);
                creep.memory.werk=false;
            }
        }
        else if(drops.length > 0){
            var target=creep.pos.findClosestByRange(drops);
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else if(tombstone){
            if(creep.withdraw(tombstone,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(tombstone);
            }
        }
        else if(speicher){
            if(creep.pos.isNearTo(speicher)){
                creep.withdraw(speicher,RESOURCE_ENERGY);
            }
            else{
                creep.moveTo(speicher);
            }
        }
    }
}
            



module.exports = roleDistributor