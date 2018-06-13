var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCarrier = require('role.carrier');
var roleClaimer = require('role.claimer');
var roleDistributor = require('role.distributor');
var roleBummi = require('role.bummi');
var roleRepairer = require ('role.repairer');
var rolePaver = require('role.paver');
var roleTapper = require('role.tapper');
var conspa = require('config.spawns');

Object.defineProperty(Creep.prototype, 'home', {
    get: function(){
        if(!this._home){
            this._home = Game.rooms[this.memory.home];
        }
        return this._home;
    },
    enumerable: false,
    configurable: true
});
//I'm trying to cache things here.
var noLimits = Memory.energie ? Memory.claim.map(c => new Object()):[{}];
console.log('global reset '+JSON.stringify(noLimits));

//place for testing stuff beforehand








module.exports.loop = function () {
    //place for testing stuff at the start








    //set Training room variable.
    var sim = Object.keys(Game.rooms)[0] === 'sim' ? true : false;
    //function to find out who governs a current room.
    var gov = room => {
        let index = Memory.rooms[room];
        if(Memory.claim[index].rank>1){
            return room
        }
        else{
            return Memory.claim[Memory.rooms[Memory.claim[index].parent]].rank > 1 ? Memory.claim[index].parent : Memory.claim[Memory.rooms[Memory.claim[index].parent]].parent;
        }
    }
    
// initialize. this only runs once at the start of a lifetime of a Game. 
    if(!Memory.energie){
        sim ? console.log('sim') : console.log('no sim');
        Memory.init = {}; //make misc. Object
        Memory.init.CPU = false; // set to true in the CONSOLE to read out per creep cpu usage.
        Memory.init.CREEPS = true; // set this to false in the CONSOLE to halt all creep AI
        Memory.init.cpuAvg = [];
        Memory.init.smallCpuAvg = [];
        Memory.init.intense = Game.time-1; // this is for the first rare calculation
        Memory.init.number = 0; // count spawned creeps.
        Memory.init.roads = false; // there are no roads to begin with ;-)
        Memory.paving = {}; // Object to control road maintenence
        Memory.paving.raum = [Object.keys(Game.rooms)[0]];
        Memory.paving.roads = [];
        Memory.energie = {}; // Energy gathering management
        Memory.energie.quelle = []; //source Ids
        Memory.energie.raum = [];
        Memory.energie.distance = [];
        Memory.energie.position = [];
        Memory.energie.waiting = [];
        Memory.energie.ordered = [];
        Memory.energie.haufen = [];
        Memory.energie.conti = [];
        Memory.energie.gov = [];
        Memory.claim = [];
        Memory.claim[0]= {};
        Memory.claim[0].id=Game.rooms[Object.keys(Game.rooms)[0]].controller.id;
        Memory.claim[0].room = Object.keys(Game.rooms)[0];
        Memory.claim[0].spawns= [_.filter(Game.spawns, (spawn) => spawn.room.name == Memory.claim[0].room)[0].id];
        Memory.claim[0].hostile = 0;
        Memory.claim[0].rank = 1.5; //starter
        Memory.rooms = {};
        let sources = Game.rooms[Memory.claim[0].room].find(FIND_SOURCES);
        Memory.claim[0].maxCarriers = sources.length;
        for (let n=0;n<sources.length;n++){
            Memory.energie.ordered[n]=0
            Memory.energie.quelle[n]=sources[n].id;
            Memory.energie.raum[n]=sources[n].room.name;
            Memory.energie.gov[n] = Memory.claim[0].room;
            if(sim){Memory.energie.distance[n] = Game.rooms[Memory.claim[0].room].findPath(Game.getObjectById(Memory.claim[0].spawns[0]).pos,sources[n].pos,{range: 1}).length;}
            else{Memory.energie.distance[n] = PathFinder.search(Game.getObjectById(Memory.claim[0].spawns[0]).pos,sources[n],{range: 1}).path.length;}
            console.log('energy source found: ' + Memory.energie.quelle.length);
        }
    }
    if(!sim&&Game.rooms[Memory.claim[0].room].storage){new RoomVisual(Memory.claim[0].room).text(Math.round(Game.rooms[Memory.claim[0].room].storage.store.energy/1000)+'k |'+Memory.energie.waiting.map(e => e-Memory.energie.ordered[Memory.energie.waiting.indexOf(e)])+'| rare: '+(Memory.init.intense-Game.time), 19, 26,{align: 'left'});}
    
    //preinitializing performance monitor
    if (Memory.init.CPU && !Memory.init.cpuAvg.length){
        Memory.init.cpuAvg = [];
        for(let n=0;n<10;n++){
            Memory.init.cpuAvg[n] = [];
        }
    }
    else if(!Memory.init.CPU){Memory.init.cpuAvg=[];}
    
    //RARE EVENT
    if (Game.time >= Memory.init.intense){
        Memory.init.intense = Math.ceil(Game.time+Math.random()*10)+3
        var rare = true;
        //console.log('rare');
        Memory.init.x = Memory.init.x ? false : 5+Math.floor((Math.random()+Math.random()+Math.random())*40/3);
        Memory.init.y = Memory.init.y ? false : 5+Math.floor((Math.random()+Math.random()+Math.random())*40/3);
        
        // we must know our energy limit
        Memory.init.extis = Game.rooms[Memory.claim[0].room].energyCapacityAvailable;

        // any flags to worry about?
        if(Object.keys(Game.flags).length>0){
            // yellow (claim and harvest) flag respnsibility logic
            let flags = _.filter(Game.flags, flag => flag.color == 6); // yellow flags.
            for (let flag of flags) {
                if(!flag.memory.home){
                    console.log('new flag: '+flag.name)
                    let Exits = Game.map.describeExits(flag.pos.roomName)
                    for(let k = 1; k < 9;k+=2){
                        let Exit = Exits[String(k)];
                        let index = Memory.rooms[Exit];
                        if(index > -1){
                            if (Memory.claim[index].rank > 1){
                                flag.memory.home = Memory.claim[index].room;
                                flag.memory.parent = Memory.claim[index].room;
                            }
                            else{
                                flag.memory.home = Memory.claim[index].parent;
                                flag.memory.parent = Memory.claim[index].room;
                            }
                        }
                    }
                }

            }
        }
        
        //RARE CLAIM LOOP for room updates!
        for(let n = 0;n < Memory.claim.length;n++){
            //make roomdex object
            Memory.rooms[Memory.claim[n].room]= n;
            //gather spawns for ALL ranks!
            let spwns = _.filter(Game.spawns, (spawn) => spawn.room.name == Memory.claim[n].room);
            Memory.claim[n].spawns=[];
            for(let m = 0;m < spwns.length;m++){
                Memory.claim[n].spawns[m]=spwns[m].id;
            }
            
            //change rank if eligible
            if(Memory.claim[n].rank == 0 && Game.rooms[Memory.claim[n].room]){
                if(Game.rooms[Memory.claim[n].room].controller.my){
                    Memory.claim[n].rank = 1;
                }
            }
            else if(Memory.claim[n].rank < 2 && Game.rooms[Memory.claim[n].room]){
                if(Game.rooms[Memory.claim[n].room].storage){
                    Memory.claim[n].rank = 2;
                }
            }
            else if(Memory.claim[n].rank == 2 && Math.min(...Object.values(Game.map.describeExits(Memory.claim[n].room)).map(c => Memory.claim[Memory.rooms[c]].rank))==2){
                Memory.claim[n].rank = 3;
            }
            
            // END HERE FOR REMOTE ROOMS and Outposts
            if(Memory.claim[n].rank <= 1){continue;}

            // Define territory of a room, lesser or equal rank for first layer, lesser for the second.
            if(!sim){
                let nachEins = Game.map.describeExits(Memory.claim[n].room);
                let rankEins = Memory.claim[n].rank;
                let Territorium = [Memory.claim[n].room];
                for(let k = 1; k < 9;k+=2){
                    let Eins = nachEins[String(k)]
                    let einsIndex = Memory.rooms[Eins];
                    if(einsIndex > -1){
                        if(Eins&&Memory.claim[einsIndex].rank <= rankEins){
                            Territorium.push(Eins);
                            let nachZwei = Game.map.describeExits(Eins);
                            for(let m = 1; m < 9;m+=2){
                                let Zwei = nachZwei[String(m)];
                                let zweiIndex = Memory.rooms[Zwei];
                                zweiIndex > -1 ? (Zwei && Memory.claim[zweiIndex].rank < rankEins)? Territorium.push(Zwei):'':'';
                            }
                        }
                    }
                }
                Memory.claim[n].territory = Territorium; 
            }else if(sim){Memory.claim[n].territory = ['sim'];}

            // find and build stuff
            let spawn = spwns[0];
            if(spawn){
                let linkA = _.filter(Game.rooms[Memory.claim[n].room].lookForAt(LOOK_STRUCTURES,spawn.pos.x,spawn.pos.y-3),{'structureType':'link'})[0];
                if(linkA){Memory.claim[n].linkA = linkA.id;}
                let ctrl = Game.rooms[Memory.claim[n].room].controller.pos;
                let linkB = _.filter(Game.rooms[Memory.claim[n].room].lookForAtArea(LOOK_STRUCTURES,ctrl.y-4,ctrl.x-4,ctrl.y+4,ctrl.x+4,{asArray: true}),{'structure':{'structureType':'link'}})[0];
                if(linkB){Memory.claim[n].linkB = linkB.structure.id;}
                //build stuff
                if(Game.rooms[Memory.claim[n].room].controller.level >=4 && !Game.rooms[Memory.claim[n].room].storage){
                    Game.rooms[Memory.claim[n].room].createConstructionSite(spawn.pos.x,spawn.pos.y+3,STRUCTURE_STORAGE);
                }
                if(Game.rooms[Memory.claim[n].room].controller.level >=5 && !linkA){
                    Game.rooms[Memory.claim[n].room].createConstructionSite(spawn.pos.x,spawn.pos.y-3,STRUCTURE_LINK);
                }
            }

            // calculate CARRYies/maxCarriers for each source the room has to govern.
            let roomNRG = Game.rooms[Memory.claim[n].room].energyCapacityAvailable;
            let WORKs = Math.min(Math.floor((roomNRG-300)/50/5)+2,5)  // the amount of WORK per Harvester. (6 not included, as 5 is maximum harvest possible.)
            Memory.init.WORKs = WORKs; // this is still needed elsewhere, sadly temp
            if(Memory.init.roads){Memory.claim[n].maxCarries = Math.min(32,Math.floor(roomNRG/150)*2);} // road vehicles require 'less' parts per volume
            else{Memory.claim[n].maxCarries = Math.min(25,Math.floor((roomNRG)/100));}  // no roads
            let distance = 0;
            for(let m=0;m<Memory.energie.quelle.length;m++){
                if(Memory.energie.gov[m]===Memory.claim[n].room){
                    distance += Memory.energie.distance[m]
                }
            }
            //this amount of Carriers are going to be built ... always.
            Memory.claim[n].maxCarriers = Math.ceil(distance*2.2*WORKs*2/50/Memory.claim[n].maxCarries);
            //each carrier will have this many CARRY parts.
            Memory.claim[n].isCarries = Math.min(Math.ceil(distance*2.2*WORKs*2/50/Memory.claim[n].maxCarriers),Memory.claim[n].maxCarries);

            // Find walls and ramparts to repair
            let defenses = Game.rooms[Memory.claim[n].room].find(FIND_STRUCTURES, {
                filter: (structure) => {
                return (structure.structureType == STRUCTURE_WALL ||
                        structure.structureType == STRUCTURE_RAMPART) &&
                        structure.hitsMax-structure.hits>500;
                }});
            let defenseLimit = 0;
            let defenseHits = [];
            Memory.claim[n].defenses = [];
            if(defenses.length){
                for (let k = 0;k < defenses.length;k++){
                    defenseHits[k]=defenses[k].hits;
                }
                let square = Math.min(...defenseHits) < 1000 ? 2:1;
                let scale = Math.pow(defenseHits.length,square) // the bigger the better?
                defenseLimit = (scale*Math.min(...defenseHits) + _.sum(defenseHits))/(scale*2);
                _.remove(defenses, function(thing) {return thing.hits > defenseLimit}) //gives an array with below average defense structures.
                //var Sterkmy = defenses.length+'@'+_.floor(defenseLimit/1000000,2)+'M'; // used to make repairers say something.
                for(let l = 0;l < defenses.length;l++){
                    Memory.claim[n].defenses[l]=defenses[l].id;
                }
            }
        }
        //END OF RARE CLAIM LOOP
        
        // Initialize Road maintenance once roads are found
        if(!Memory.paving.current){
            let roads = Game.rooms[Memory.paving.raum[0]].find(FIND_STRUCTURES,{filter: (structure) => {return structure.structureType == STRUCTURE_ROAD }});
            if(roads.length){
                Memory.paving.current = Memory.paving.raum[0];
                for(let n = 0;n < roads.length;n++){
                    Memory.paving.roads[n]=roads[n].id
                }
                console.log('Roads detected. Initialising road maintenance program...')
            }
        }

        //Gather Energy source Information to manage and oversee Carrier jobs
        for(let n = 0; n < Memory.energie.quelle.length;n++){
            // set governing room of energy source and new distances, if governing room changed.
            if(Memory.energie.gov[n] !== gov(Memory.energie.raum[n])||!Memory.energie.gov[n]){
                Memory.energie.gov[n] = gov(Memory.energie.raum[n]);
                Memory.energie.distance[n] = PathFinder.search(Game.getObjectById(Memory.claim[Memory.rooms[Memory.energie.gov[n]]].spawns[0]).pos,Game.getObjectById(Memory.energie.quelle[n]),{range: 1}).path.length;
            }
            //++ check if there are "surplus" orders running, without corresponding carriers existing.
            if(Memory.energie.ordered[n]&&!_.filter(Game.creeps, creep => (creep.memory.job == Memory.energie.quelle[n] && creep.memory.travel)).length){
                Memory.energie.ordered[n] = 0;
                console.log('an order got deleted at '+n);
            }
            // create container and dropped energy source Id's.
            if(Game.rooms[Memory.energie.raum[n]]&&Memory.energie.position[n]){
                Memory.energie.waiting[n] = 0;
                
                //++create and monitor container Id
                if(!Memory.energie.conti[n]){
                    let conti = _.filter(Game.rooms[Memory.energie.raum[n]].lookForAt(LOOK_STRUCTURES,Memory.energie.position[n].x,Memory.energie.position[n].y),{'structureType':'container'})[0];
                    if(conti){Memory.energie.conti[n] = conti.id;}
                }
                //add container energy amount
                else{Memory.energie.waiting[n] = Game.getObjectById(Memory.energie.conti[n]).store.energy;}
                
                //create and monitor dropped energy Id
                if(Game.getObjectById(Memory.energie.haufen[n])){
                    var waiting = Game.getObjectById(Memory.energie.haufen[n])
                }
                else{
                    var waiting = Game.rooms[Memory.energie.raum[n]].lookForAt(LOOK_RESOURCES,Memory.energie.position[n].x,Memory.energie.position[n].y)[0];
                }
                // add dropped energy amount
                if(waiting){
                    Memory.energie.waiting[n] += waiting.amount;
                    Memory.energie.haufen[n] = waiting.id;
                }
                else{
                    Memory.energie.haufen[n] = 0;
                }
            }
            // delete negative orders.
            if(Memory.energie.ordered[n]<0){Memory.energie.ordered[n] = 0;}
        }
    }
    //END OF RARE EVENT

    // Memory cleanup, removing dead creep's memory.
    for(let name in Memory.creeps){
        if(!Game.creeps[name]) {
            console.log('This creep probably died: '+Memory.creeps[name].role+' '+name);
            delete Memory.creeps[name];
        }
    }

    //ROOM LOOP
    var harvesters = [], upgraders = [], builders = [], carriers = [], bummis =[], claimers =[], distributors=[], repairers =[], pavers=[], tappers=[];
    for(let roomdex = 0;roomdex < Memory.claim.length;roomdex++){
        let rank = Memory.claim[roomdex].rank;
        // FUCK THIS SHIT, IF this room isn't developed.
        if(rank === 0){continue;}
        let raum = Memory.claim[roomdex].room;
        let limits = noLimits[roomdex];

        //check see if there's a yellow flag this room has to worry about.
        limits.flags = _.filter(Game.flags,flag => flag.color == 6&&flag.memory.home === raum); // yellow flags.

        // use free spawn, if more than 1 available.
        let spawn = {};
        for(let m = 0;m<Memory.claim[roomdex].spawns.length;m++){
            spawn = Game.getObjectById(Memory.claim[roomdex].spawns[m])
            if(!spawn.spawning){break;}
            // call parent room for a spawn to use if no break after last iteration.
            if(m === Memory.claim[roomdex].spawns.length-1 && Memory.claim[roomdex].parent){
                let pardex = Memory.rooms[Memory.claim[roomdex].parent];
                for (k = 0; k<Memory.claim[pardex].spawns.length;k++){
                    spawn = Game.getObjectById(Memory.claim[pardex].spawns[k])
                    if(!spawn.spawning){break;}
                }
            }
        }
        
        limits.drops = spawn.pos.findInRange(FIND_DROPPED_RESOURCES,7);

        // Extended Tutorial tower behavior FIND_MY_CREEPS
        let towers = spawn.room.find(FIND_STRUCTURES,{filter:s=>s.structureType == STRUCTURE_TOWER});
        let towergy= false;
        if(towers.length) {
            let friend = spawn.pos.findClosestByRange(FIND_MY_CREEPS,{filter: f => f.hits<f.hitsMax});
            let closestHostile = spawn.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            for(let n=0;n<towers.length;n++){
                // do towers need energy?
                if(!towergy){towergy = towers[n].energy < towers[n].energyCapacity;}
                if(friend){
                    towers[n].heal(friend);
                }
                if(closestHostile) {
                    towers[n].attack(closestHostile);
                }
            }
        } 
        let linkA = Game.getObjectById(Memory.claim[roomdex].linkA);
        let linkB = Game.getObjectById(Memory.claim[roomdex].linkB);
        let linkgy = false;
        // Links need energy?
        if(linkA&&linkB){
            linkgy = linkA.energy<linkA.energyCapacity;
            if(linkB.energy < 766){linkA.transferEnergy(linkB);}
        }
        else if(linkA && !linkB){
            let ctrl = Game.rooms[Memory.claim[roomdex].room].controller.pos;
            new RoomVisual(Memory.claim[roomdex].room).text('Build Link!',ctrl.x,ctrl.y+1);
            new RoomVisual(Memory.claim[roomdex].room).rect(ctrl.x-4,ctrl.y-4,8,8,{fill: 'transparent', stroke: '#fff'});
            linkgy = linkA.energy<linkA.energyCapacity;
        }

        // find energy structures needing energy
        if(Game.rooms[raum].energyAvailable<Game.rooms[raum].energyCapacityAvailable||towergy||linkgy){
            limits.energyNeed = Game.getObjectById(Memory.claim[roomdex].spawns[0]).pos.findInRange(FIND_STRUCTURES,7, {
                                filter: (structure) => {
                                return (structure.structureType == STRUCTURE_LINK ||
                                        structure.structureType == STRUCTURE_EXTENSION ||
                                        structure.structureType == STRUCTURE_TOWER ||
                                        structure.structureType == STRUCTURE_SPAWN) &&
                                        structure.energy < structure.energyCapacity;
                                }});
        }
        else{limits.energyNeed = [];}
        var extis = Game.rooms[raum].energyCapacityAvailable;   

        limits.sites = [];
        limits.siteroom = [];
        // Hivemind searching for enemies and construction sites over the territory  
        Memory.claim[roomdex].hostile = Game.rooms[raum].find(FIND_HOSTILE_CREEPS).length;
        for (let room of Memory.claim[roomdex].territory){
            if (Game.rooms[room]){
                let bites = Game.rooms[room].find(FIND_CONSTRUCTION_SITES);
                if(bites.length&&!limits.sites.length){
                    limits.sites=bites;
                    limits.siteroom = room;
                }
                let index = Memory.rooms[room];
                Memory.claim[index].hostile = Game.rooms[room].find(FIND_HOSTILE_CREEPS).length;
            }
        }
        
        // Alarming all the Bummis
        Memory.claim[roomdex].Alarm = Math.max(...Memory.claim.map(claim => claim.hostile));
        Memory.claim[roomdex].AlarmRoom = Memory.claim[roomdex].Alarm ?  Memory.claim[Memory.claim.findIndex(claim => claim.hostile === Memory.claim[roomdex].Alarm )].room : false;
        
        // maximum amount of upgraders. Always 1 upgrader (and a builder?) if construction is a thing and storage isn't.
        if(Game.rooms[raum].controller.level === 8){
            limits.maxUpgraders = 1;
        }
        else if(Game.rooms[raum].storage){
            let divider = Game.rooms[raum].controller.level*Game.rooms[raum].energyCapacityAvailable;
            limits.maxUpgraders = Math.max(Math.floor(Game.rooms[raum].storage.store.energy/divider), 1);
        }
        else{
            let haufen = Game.rooms[raum].lookForAt(LOOK_RESOURCES,spawn.pos.x,spawn.pos.y-3)[0];
            if(haufen){
                limits.maxUpgraders = Math.max(Math.floor(haufen.amount/Game.rooms[raum].energyCapacityAvailable), 1)
            }
            else{
                limits.maxUpgraders = 1;
            }
        }

        //counting and categorizing creeps for each room.
        harvesters[roomdex]= _.filter(Game.creeps, creep => creep.memory.role == 'harvester' && creep.memory.home == raum);
        upgraders[roomdex]= _.filter(Game.creeps, creep => creep.memory.role == 'upgrader' && creep.memory.home == raum);
        builders[roomdex]= _.filter(Game.creeps, creep => creep.memory.role == 'builder' && creep.memory.home == raum);
        carriers[roomdex]= _.filter(Game.creeps, creep => creep.memory.role == 'carrier' && creep.memory.home == raum);
        bummis[roomdex]= _.filter(Game.creeps, creep=> creep.memory.role == 'bummi' && creep.memory.home == raum);
        claimers[roomdex]= _.filter(Game.creeps, creep => creep.memory.role == 'claimer' && creep.memory.home == raum);
        distributors[roomdex]   = _.filter(Game.creeps, creep => creep.memory.role == 'distributor' && creep.memory.home == raum);
        repairers[roomdex]= _.filter(Game.creeps, creep => creep.memory.role == 'repairer' && creep.memory.home == raum);
        pavers[roomdex]= _.filter(Game.creeps, creep => creep.memory.role == 'paver' && creep.memory.home == raum);
        tappers[roomdex]= _.filter(Game.creeps, creep=> creep.memory.role == 'tapper' && creep.memory.home == raum);
        limits.maxBuilders = Math.min(upgraders[roomdex].length,limits.sites.length);
        
        //Spawn Claimers
        let needclaim = false; // don't build upgraders, if we need claimers.
        if (extis >= 1300 && !Memory.claim[roomdex].Alarm && distributors[roomdex].length && Memory.claim[roomdex].rank > 1){
            for (let n=0;n < Memory.claim[roomdex].territory.length;n++){
                let index = Memory.rooms[Memory.claim[roomdex].territory[n]];
                //check if... rank is 0, then if parent or else parent of parent is this.
                if(Memory.claim[index].rank > 0){continue;}
                if(gov(Memory.claim[index].room) !== raum){continue;}
                let sourceId = Memory.claim[index].id;
                var claim = false;
                if(Game.rooms[Memory.claim[index].room] && Memory.claim[index].rank === 0){
                    if(Game.getObjectById(sourceId).reservation){
                        if(Game.getObjectById(sourceId).reservation.ticksToEnd<1000){
                            claim = true;
                        }
                    }
                    else if(!Game.getObjectById(sourceId).reservation){
                        claim = true;
                    }
                }
                if (!_.some(claimers[roomdex], c => c.memory.role == 'claimer' && c.memory.sourceId == sourceId) && claim){
                    spawn.spawnCreep([CLAIM,CLAIM,MOVE,MOVE], 'Cla'+conspa.morsch(), {memory: {role: 'claimer', sourceId: sourceId, home: raum}});
                    needclaim = true;
                    break;   
                }
            }
        }
        
        //Spawn Harvesters
        if(!limits.maxHarvesters||rare){
            limits.maxHarvesters = _.filter(Memory.energie.gov, quelle => quelle === raum).length;
        }
        if(harvesters[roomdex].length&&harvesters[roomdex].length < limits.maxHarvesters){
            // using the numbers to spawn "oldest source" first
            for (let n = 0; n < Memory.energie.quelle.length; n++){
                //ignore sources not belonging to this room.
                if(Memory.energie.gov[n] !== raum){continue;}
                let sourceId = Memory.energie.quelle[n];
                if (!_.some(Game.creeps, c => c.memory.role == 'harvester' && c.memory.sourceId == sourceId)){
                    spawn.spawnCreep(conspa.spwnHar(extis, n), 'Har'+conspa.morsch(), {memory: {role: 'harvester', sourceId: sourceId, home: raum}});
                    break;
                }
            }
        }

        //Spawning all the other creeps
        if(!harvesters[roomdex].length){
            spawn.spawnCreep(conspa.spwnHar(300, Memory.energie.raum.indexOf(raum)), 'Har'+conspa.morsch(), {memory: {role: 'harvester', sourceId: Memory.energie.quelle[Memory.energie.raum.indexOf(raum)], home: raum}});  
        }
        else if(!carriers[roomdex].length){
            if(spawn.spawnCreep(conspa.spwnCar(Memory.claim[roomdex].isCarries,Memory.init.roads), 'Car'+conspa.morsch(), {memory: {role: 'carrier', home: raum}}) != 0){
                spawn.spawnCreep(conspa.spwnCar(3,false), 'Car'+conspa.morsch(), {memory: {role: 'carrier', home: raum}});
            }
        }
        else if(!upgraders[roomdex].length){
            if(spawn.spawnCreep(conspa.spwnUpg(extis,roomdex), 'Untgrad '+conspa.morsch(), {memory: {role: 'upgrader', home: raum}}) !=0){
                spawn.spawnCreep([WORK,CARRY,MOVE], 'Untgrad '+conspa.morsch(), {memory: {role: 'upgrader', home: raum}}); 
            }
        }
        else if(bummis[roomdex].length < 1&& (extis-300)/50 > 4&&!sim&&false){
            spawn.spawnCreep(conspa.spwnBum(extis), 'Bum'+conspa.morsch(), {memory: {role: 'bummi', raum: Game.rooms[Memory.claim[1].room].name, home: raum}});
        }
        else if((distributors[roomdex].length < 1 && extis > 300) || (distributors[roomdex].length < 1 && harvesters[roomdex].length == limits.maxHarvesters)){
            spawn.spawnCreep(conspa.spwnCar(Math.min(32,Math.floor((extis)*2/150)),true), 'Dis'+conspa.morsch(), {memory: {role: 'distributor', home: raum}});
        }
        else if(tappers[roomdex].length < 1 && limits.flags.length){
            spawn.spawnCreep([MOVE], 'Tap'+conspa.morsch(), {memory: {role: 'tapper', home: raum}});
        }
        else if((builders[roomdex].length < limits.maxBuilders && limits.sites.length && (extis-300)/50 > 0 ) ||
                (builders[roomdex].length <limits.maxBuilders && limits.sites.length && harvesters[roomdex].length == limits.maxHarvesters)){
            spawn.spawnCreep(conspa.spwnBui(extis), 'Bui'+conspa.morsch(), {memory: {role: 'builder', home: raum}});
        }
        else if(_.sum(pavers.map(c => c.length)) < 1&&Memory.paving.current&&(extis-300)/50>20&&carriers[roomdex].length>Memory.claim[roomdex].maxCarriers/2){ 
            spawn.spawnCreep([WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 'Pav'+conspa.morsch(), {memory: {role: 'paver', home: raum}});
        }
        else if(_.sum(pavers.map(c => c.length)) < 1&&Memory.paving.current&&(extis-300)/50>4&&carriers[roomdex].length>Memory.claim[roomdex].maxCarriers/2){
            spawn.spawnCreep([WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], 'Pav'+conspa.morsch(), {memory: {role: 'paver', home: raum}});
        }
        else if(repairers[roomdex].length < 1&& Memory.claim[roomdex].defenses.length&&carriers[roomdex].length>Memory.claim[roomdex].maxCarriers/2){
            spawn.spawnCreep(conspa.spwnBui(extis), 'Rep'+conspa.morsch(), {memory: {role: 'repairer', home: raum}});  
        }
        else if((carriers[roomdex].length < Math.min(Memory.claim[roomdex].maxCarriers,harvesters[roomdex].length)) ||
                (carriers[roomdex].length < Memory.claim[roomdex].maxCarriers && harvesters[roomdex].length == limits.maxHarvesters)) {
            spawn.spawnCreep(conspa.spwnCar(Memory.claim[roomdex].isCarries,Memory.init.roads), 'Car'+conspa.morsch(), {memory: {role: 'carrier', home: raum}});
        }
        else if(upgraders[roomdex].length < limits.maxUpgraders && harvesters[roomdex].length == limits.maxHarvesters&&!needclaim) {
            spawn.spawnCreep(conspa.spwnUpg(extis,roomdex), 'Untgrad '+conspa.morsch(), {memory: {role: 'upgrader', home: raum}});
        }
        
        // Spawning Bummis before everything else during alarm    
        if(Memory.claim[roomdex].Alarm && bummis[roomdex].length < Memory.claim[roomdex].Alarm){
            spawn.spawnCreep(conspa.spwnBum(extis), 'Bum'+conspa.morsch(), {memory: {role: 'bummi', raum: Memory.claim[roomdex].AlarmRoom, home: raum}});
        }
    }
    //END OF ROOM LOOP
    
    //initializing performance readout
    if(Memory.init.CPU){
        var CPU = 0;
        var cpuHar = 0;
        var cpuUpg = 0;
        var cpuBui = 0;
        var cpuCar = 0;
        var cpuCla = 0;
        var cpuDis = 0;
        var cpuRep = 0;
        var cpuPav = 0;
        var overhead = Game.cpu.getUsed();
    }

    //CREEP LOOP
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(Memory.init.CPU){CPU=Game.cpu.getUsed()}
        if (creep.spawning){}
        else if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep,carriers[Memory.rooms[creep.memory.home]].length);
            if(Memory.init.CPU){cpuHar+=Game.cpu.getUsed()-CPU}
        }
        else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep,noLimits);
            if(Memory.init.CPU){cpuUpg+=Game.cpu.getUsed()-CPU}
        }
        else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep,noLimits);
            if(Memory.init.CPU){cpuBui+=Game.cpu.getUsed()-CPU}
        }
        else if(creep.memory.role == 'carrier') {
            roleCarrier.run(creep,noLimits,distributors[Memory.rooms[creep.memory.home]].length);
            if(Memory.init.CPU){cpuCar+=Game.cpu.getUsed()-CPU}
        }
        else if(creep.memory.role == 'claimer') {
            roleClaimer.run(creep);
            if(Memory.init.CPU){cpuCla+=Game.cpu.getUsed()-CPU}
        }
        else if(creep.memory.role == 'distributor') {
            roleDistributor.run(creep,noLimits);
            if(Memory.init.CPU){cpuDis+=Game.cpu.getUsed()-CPU}
        }
        else if(creep.memory.role == 'bummi'){
            roleBummi.run(creep);
        }
        else if(creep.memory.role == 'repairer'){
            roleRepairer.run(creep);
            if(Memory.init.CPU){cpuRep+=Game.cpu.getUsed()-CPU}
        }
        else if(creep.memory.role == 'paver'){
            rolePaver.run(creep);
            if(Memory.init.CPU){cpuPav+=Game.cpu.getUsed()-CPU}
        }
        else if(creep.memory.role == 'tapper'){
            roleTapper.run(creep,noLimits)
        }
    }
    //END OF CREEP LOOP

    //Performance monitor
    if(Memory.init.CPU){
        let cpuAvg = [overhead,cpuHar,cpuUpg,cpuBui,cpuCar,cpuCla,cpuDis,cpuRep,cpuPav,Game.cpu.getUsed()];
        for(let n=0;n<10;n++){
            Memory.init.cpuAvg[n].push(cpuAvg[n]);
        }

        for(let n=0;n<10;n++){
            cpuAvg[n]=_.sum(Memory.init.cpuAvg[n])/Memory.init.cpuAvg[n].length;
        }

        if(!sim){
        let stellen = 100;
        new RoomVisual('E47S39').text(' Ovr: '+Math.round(cpuAvg[0]*stellen)/stellen, 19, 27,{align: 'left'});
        new RoomVisual('E47S39').text('\nHar:'+Math.round(cpuAvg[1]*stellen/_.sum(harvesters.map(c => c.length)))/stellen, 19, 28,{align: 'left'});
        new RoomVisual('E47S39').text('\nUpg:'+Math.round(cpuAvg[2]*stellen/_.sum(upgraders.map(c => c.length)))/stellen, 19, 29,{align: 'left'});
        new RoomVisual('E47S39').text('\nBui:'+Math.round(cpuAvg[3]*stellen/_.sum(builders.map(c => c.length)))/stellen, 19, 30,{align: 'left'});
        new RoomVisual('E47S39').text('\nCar:'+Math.round(cpuAvg[4]*stellen/_.sum(carriers.map(c => c.length)))/stellen, 19, 31,{align: 'left'});
        new RoomVisual('E47S39').text('\nCla:'+Math.round(cpuAvg[5]*stellen/_.sum(claimers.map(c => c.length)))/stellen, 19, 32,{align: 'left'});
        new RoomVisual('E47S39').text('\nDis:'+Math.round(cpuAvg[6]*stellen/_.sum(distributors.map(c => c.length)))/stellen, 19, 33,{align: 'left'});
        new RoomVisual('E47S39').text('\nRep:'+Math.round(cpuAvg[7]*stellen/_.sum(repairers.map(c => c.length)))/stellen, 19, 34,{align: 'left'});
        new RoomVisual('E47S39').text('\nPav:'+Math.round(cpuAvg[8]*stellen/_.sum(pavers.map(c => c.length)))/stellen, 19, 35,{align: 'left'});
        new RoomVisual('E47S39').text('\nSum:'+Math.round(cpuAvg[9]*stellen)/stellen, 19, 36,{align: 'left'});
        
            if(Memory.init.cpuAvg[0].length > Memory.init.CPU){
                for(let n = 0; n < Memory.init.cpuAvg.length;n++){
                    Memory.init.cpuAvg[n].shift();
                }
            }
        }
    }
    let avG = Memory.init.smallCpuAvg.length;
    if(avG >= 20){Memory.init.smallCpuAvg.shift();}
    Memory.init.smallCpuAvg.push(Game.cpu.getUsed());
    if(!sim){new RoomVisual(Memory.claim[0].room).text('Carriers: '+carriers[Memory.rooms[Memory.claim[0].room]].length+' | CPU('+avG+' tics): '+Math.round(_.sum(Memory.init.smallCpuAvg)/avG*10)/10+' | Bucket: '+Game.cpu.bucket, 19, 25,{align: 'left'});}

    // place for testing stuff at the end.

 
 
 
 
 
    
}