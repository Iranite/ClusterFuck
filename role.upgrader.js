var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep,link,noLimits) {
        let spawn = Game.getObjectById(Memory.claim[Memory.claim.findIndex(claim => claim.room === creep.memory.home)].spawns[0]);
        let speicher = creep.home.storage;
        var homedex = Memory.claim.findIndex(claim => claim.room === creep.memory.home);
        var home = Game.getObjectById(Memory.claim[homedex].spawns[0]).name
        let drops = noLimits[homedex].drops;

        
        if(creep.memory.werk && creep.carry.energy == 0&&!Memory.init.Alarm) {
            creep.memory.werk = false;
	    }
	    if((!creep.memory.werk && creep.carry.energy == creep.carryCapacity)||Memory.init.Alarm) {
	        creep.memory.werk = true;
	    }
        
        //Time to leave
        if(creep.ticksToLive < creep.carryCapacity/creep.getActiveBodyparts(WORK)&&creep.carry.energy == 0){
            creep.say('bye...')
            if(spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE){
                creep.moveTo(spawn);
            }
        }
	    else if(creep.memory.werk) {
            if(creep.upgradeController(creep.home.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.home.controller);
                creep.repair(Game.getObjectById(Memory.init.speicher));
            }
        }
        else if(drops.length > 0){
            var target=creep.pos.findClosestByRange(drops);
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else if(Memory.init.link&& creep.room.name == Game.spawns.tuis.room.name){
            if(creep.withdraw(link,RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(link);
            }
        }
        else if(creep.home.storage){
            if(creep.pos.isNearTo(creep.home.storage)){
                creep.withdraw(creep.home.storage,RESOURCE_ENERGY);
            }
            else{
                creep.moveTo(creep.home.storage);
            }
        }
        else if(spawn.room.energyAvailable == spawn.room.energyCapacityAvailable||home == 'daar'){
                creep.withdraw(spawn,RESOURCE_ENERGY);
                creep.moveTo(spawn);
        }
	}
};

module.exports = roleUpgrader;