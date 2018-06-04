# ClusterFuck

Screeps.com offers a platform to create your own AI to battle other people in a real time strategy game.
The AI is programmed in JavaScript.

This AI is is my AI.

The main concepts are roles, rules and a strong hierarchy. Furthermore the AI is inspired by mold growth, transport networks and gene expression.
    As taught by the tutorial, each creep has a role.
        No matter the role, each creep belongs to a room, called home.
            A creep can only do what its home tells it to.
            A home can send a creep to help another room, but the creep will only obey its home room.
    Each room has a rank, depending on its neighbours and abilities, which defines its role.
        Each room governs its territory, where it will harvest, build or fight.
        Room territories may overlap, creating (hopefully) strong military mechanisms and ClusterFucks.
    Colony growth will always happen depending on available resources, enemy presence and some other not thought of parameters.
        Once there is a free room (GCL++ or defeated by the enemy), every room will put up his favorite canditate.
            The highest scoring candidate will get populated.

<b>Current status:</b>
The AI can only handle 1 room.
Colony growth has to be called for manually.
Military consists of a lonely patrol boat and wonky towers.

