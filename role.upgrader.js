var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep,noLimits) {
        let speicher = creep.home.storage;
        var homedex = Memory.rooms[creep.memory.home];
        let spawn = Game.getObjectById(Memory.claim[homedex].spawns[0]);
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
            creep.upgradeController(creep.home.controller);
            creep.moveTo(creep.home.controller,{range: 2});
        }
        else if(drops.length > 0){
            var target=creep.pos.findClosestByRange(drops);
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
        else if(Memory.claim[homedex].linkB&& creep.room.name == creep.memory.home){
            if(creep.withdraw(Game.getObjectById(Memory.claim[homedex].linkB),RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(Game.getObjectById(Memory.claim[homedex].linkB));
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
        else if(spawn.room.energyAvailable == spawn.room.energyCapacityAvailable){
                creep.withdraw(spawn,RESOURCE_ENERGY);
                creep.moveTo(spawn);
        }
	}
};

module.exports = roleUpgrader;