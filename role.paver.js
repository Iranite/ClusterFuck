/*                  
 *              Creep role: Paver
 * The Paver will search for roads and containers that 
 * need repairs, and travel along the country to do
 * just that. It will find energy to do so along the
 * way. Currently there will only be one paver at a given
 * time. There might be a necessity for more, though.
 * 
 */
var rolePaver = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let homedex = Memory.rooms[creep.memory.home];
        let spawn = Game.getObjectById(Memory.claim[homedex].spawns[0]);
        let speicher = creep.home.storage;
        let WORKs = creep.getActiveBodyparts(WORK);
        
    // getting rooms and their roads
        if(!Memory.paving.roads.length){
            if (Memory.paving.raum.length>1){
                Memory.paving.raum.shift();
            }
            else if(Memory.paving.raum.length <=1){
                Memory.paving.raum = Memory.claim.map(claim=> claim.room);
            }
            Memory.paving.current = Memory.paving.raum[0];
            if(Game.rooms[Memory.paving.current]){
                let roads = Game.rooms[Memory.paving.current].find(FIND_STRUCTURES,{filter: structure => {return (structure.structureType == STRUCTURE_ROAD ||
                                                                                                                  structure.structureType == STRUCTURE_CONTAINER) &&
                                                                                                                  structure.hitsMax-structure.hits >= WORKs*100;}});
                for(let n = 0;n < roads.length;n++){
                    Memory.paving.roads[n]=roads[n].id;
                }
            }
        }
        var siteroom = Memory.paving.current;
    // Setting working condition
	    if(creep.memory.werk && creep.carry.energy == 0) {
            creep.memory.werk = false;
	    }
	    if(!creep.memory.werk && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.werk = true;
	    }
	    
        //Time to leave
        if(creep.ticksToLive < creep.carryCapacity/WORKs+25&&creep.carry.energy == 0){
            creep.say('bye...')
            if(spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE){
                creep.travelTo(spawn);
            }
        }
    // go working
	    else if(creep.memory.werk) {
            //panic reaction
	        if(siteroom == Memory.claim[homedex].AlarmRoom){
	            creep.travelTo(creep.home.controller);
	            creep.say('Yikes!!!',true);
	        }
	        else if(creep.room.name == siteroom){
                // move a step into the room when on the Exit...
	            if(creep.pos.x == 0||creep.pos.y == 0){creep.move(3);}
                else if(creep.pos.x == 49||creep.pos.y == 49){creep.move(8);}
                let road;
                // get last road
                if(creep.memory.job){
                    road = Game.getObjectById(creep.memory.job);
                    // did we loose the road?
                    if(!road){
                        Memory.paving.roads.splice(Memory.paving.roads.indexOf(creep.memory.job),1);
                        creep.memory.job = false;
                    }
                    // did we heal the road?
                    else if(road.hitsMax-road.hits < WORKs*100){
                        Memory.paving.roads.splice(Memory.paving.roads.indexOf(creep.memory.job),1);
                        creep.memory.job = false;
                    }
                    // ok, take this road.
                }
                // now get a job.
                if(!creep.memory.job){
                    //ge road objects
                    let roads = Memory.paving.roads.map(r => Game.getObjectById(r));
                    //find closest
                    road = creep.pos.findClosestByRange(roads);
                    // did we loose the road?
                    if(!road){
                        // we need to check all the roads now...
                        for(n=0;n<Memory.paving.roads.length;n++){
                            if(!Game.getObjectById(Memory.paving.roads[n])){                                //delete the lost.
                                //delete the lost.
                                Memory.paving.roads.splice(n,1);
                            }
                        }
                        // now get the good roads
                        let roads = Memory.paving.roads.map(r => Game.getObjectById(r));
                        //find the closest
                        road = creep.pos.findClosestByRange(roads);
                    }
                    //ok, now we should have a good road to work on.
                    creep.memory.job = road? road.id: false
                }
                //still no job? Say some sh*t and go home.
                if(!creep.memory.job){
                    creep.say('All done!')
                    creep.travelTo(spawn)
                }
                // ok, go working!
                else if(creep.repair(road) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(road);
                }
            }
            else if(Game.rooms[siteroom]){
                creep.travelTo(Game.rooms[siteroom].controller);
            }
	        else{
	            creep.travelTo(creep.pos.findClosestByPath(creep.room.findExitTo(siteroom)));
	        }
        }
        //get energy
        else if(creep.room.name !== creep.home.name){
            let drops = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: drop => drop.amount > creep.carryCapacity-creep.carry.energy});
            if(!drops){
                let conti = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: conti => conti.structureType == STRUCTURE_CONTAINER && conti.store.energy > creep.carryCapacity-creep.carry.energy});
                if(!conti){
                    if(creep.room.storage){
                        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                        creep.travelTo(creep.room.storage);
                    }
                    else{
                        creep.travelTo(spawn);
                    }
                }
                else if(creep.withdraw(conti, RESOURCE_ENERGY)== ERR_NOT_IN_RANGE){
                    creep.travelTo(conti);
                }    
            }
            else if(creep.pickup(drops)== ERR_NOT_IN_RANGE){
                creep.travelTo(drops);
            }
        }
	    else if(speicher){
            if(creep.pos.isNearTo(speicher)){
                creep.withdraw(speicher,RESOURCE_ENERGY);
            }
            else{
                creep.travelTo(speicher);
            }
        }else if(spawn.room.energyAvailable == spawn.room.energyCapacityAvailable){
                creep.withdraw(spawn,RESOURCE_ENERGY);
                creep.travelTo(spawn);
        }
	}
};

module.exports = rolePaver;