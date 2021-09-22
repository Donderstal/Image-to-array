const ONE_BLOCK_SPRITE = {
    "dimensional_alignment": "STANDARD",
    "height_blocks": 1, "width_blocks": 1
}

const TWO_WIDE_SPRITE = { 
    "dimensional_alignment": "STANDARD",
    "height_blocks": 1, "width_blocks": 2
}

const getTwoHighSprite = ( isGrounded ) => {
    return {
        "dimensional_alignment": "STANDARD",
        "grounded_at_bottom": isGrounded,
        "height_blocks": 2,
        "width_blocks": 1
    }
}

const getGroundedAtBottom = ( width, height ) => {
    return {
        "dimensional_alignment": "STANDARD",
        "grounded_at_bottom": true,
        "height_blocks": width,
        "width_blocks": height
    }
}

const THREE_HIGH_SPRITE = {
    "dimensional_alignment": "STANDARD",
    "height_blocks": 3, "width_blocks": 1
}

const POSTER_SPRITE = {
    "dimensional_alignment": "STANDARD", "not_grounded": true,
    "height_blocks": 1.75, "width_blocks": 1.75,
}

const STANDARD_CAR = {
    "dimensional_alignment": "HORI_VERT", "isCar" : true,
    "hori_height_blocks": 3, "hori_width_blocks": 4,
    "vert_height_blocks": 3, "vert_width_blocks": 2,
    "movement_frames" : { 
        [FACING_LEFT] : [
            { "x": 0, "y": 384 },
            { "x": 0, "y": 576 }
        ],
        [FACING_UP] : [
            { "x": 0, "y": 960 },
            { "x": 128, "y": 960 }
        ],
        [FACING_RIGHT] : [
            { "x": 0, "y": 0 },
            { "x": 0, "y": 192 }
        ],
        [FACING_DOWN] : [
            { "x": 0, "y": 768 },
            { "x": 128, "y": 768 }
        ]
    }
}

const BUS = {
    "dimensional_alignment": "HORI_VERT", "isCar" : true,
    "hori_height_blocks": 3, "hori_width_blocks": 4,
    "vert_height_blocks": 4, "vert_width_blocks": 3,
    "movement_frames" : {
        [FACING_LEFT] : [
            { "x": TILE_SIZE, "y": 384 },
            { "x": TILE_SIZE, "y": 576 }
        ],
        [FACING_UP] : [
            { "x": 0, "y": 1024 },
            { "x": 192, "y": 1024 }
        ],
        [FACING_RIGHT] : [
            { "x": TILE_SIZE, "y": 0 },
            { "x": TILE_SIZE, "y": 192 }
        ],
        [FACING_DOWN] : [
            { "x": 0, "y": 768 },
            { "x": 192, "y": 768 }
        ]
    }
    
}

const STANDARD_SHELVE = {
    "dimensional_alignment": "STANDARD",
    "width_blocks": 2,
    "height_blocks": 2,
    "grounded_at_bottom": true
}

const getBackgroundItem = ( width, height ) => {
    return {
        "dimensional_alignment": "STANDARD",
        "on_background": true,
        "height_blocks": height,
        "width_blocks": width
    }
}

const getDoorOrWindow = ( width, height ) => { 
    return { 
        ...getBackgroundItem( width, height ),
        "door_or_window": true
    }
}


const getSignData = ( heightInBlocks ) => {
    return {
        "dimensional_alignment": "STANDARD",
        "height_blocks": heightInBlocks,
        "width_blocks": 1,
        "not_grounded": true,
        "idle_animation": true
    }
}

const spriteData = {
    "banana" : {
        "src": "Banana.png",
        ...getBackgroundItem( .5, .40625 )
    },
    "bar_sign": {
        "dimensional_alignment": "STANDARD",
        "src": "bar_sign.png",
        "height_blocks": 1,
        "width_blocks": 1.8125,
        "not_grounded": true,
        "idle_animation": true
    },
    "bench_a" :{
        "src": "bench_a.png",
        ...TWO_WIDE_SPRITE
    },
    "Bench_Green" :{
        "src": "bench_green.png",
        ...TWO_WIDE_SPRITE
    },
    "bin_a" :{
        "src": "bin_a.png",
        ...ONE_BLOCK_SPRITE
    },
    "bin_hop" :{
        "src": "bin_hop.png",
        ...ONE_BLOCK_SPRITE
    },
    "bin_x" :{
        "src": "bin_x.png",
        ...ONE_BLOCK_SPRITE
    },
    "block" : {
        "src": "Block.png",
        ...getBackgroundItem( 0.4375, 0.46875 )
    },
    "blue_couch_right" : {
        "src": "blue_couch_right.png",
        ...THREE_HIGH_SPRITE
    },
    "blue_double_bed" : {
        "src": "blue_double_bed.png",
        "dimensional_alignment": "STANDARD",
        "height_blocks": 2, "width_blocks": 2
    },
    "blue_lamp_left" : {
        "src": "blue_lamp_left.png",
        ...getTwoHighSprite( true )
    },
    "blue_lamp_right" : {
        "src": "blue_lamp_right.png",
        ...getTwoHighSprite( true )
    },
    "blue_lamp_right" : {
        "src": "blue_single_bed.png",
        ...getTwoHighSprite( false )
    },
    "boarded_window": {
        "src": "Boarded_Window.png",
        ...getBackgroundItem( 1.15625, 1.34375 )
    },
    "bolard_x" :{
        "src": "bolard_x.png",
        ...ONE_BLOCK_SPRITE
    },
    "Bollard" :{
        "src": "bollard.png",
        ...ONE_BLOCK_SPRITE
    },
    "boxes": {
        "src": "boxes.png",
        "dimensional_alignment": "STANDARD",
        "width_blocks": 2.09375,
        "height_blocks": 1.46875,
        "grounded_at_bottom": true
    },
    "brown_chair" :{
        "src": "brown_chair.png",
        ...ONE_BLOCK_SPRITE
    },
    "Bus_Stop" : {
        "src": "Bus_Stop.png",
        "dimensional_alignment": "STANDARD",
        "grounded_at_bottom": true,
        "height_blocks": 4,
        "width_blocks": 1
    },   
    "can_red_1" : {
        "src": "Can_Z1.png",
        ...getBackgroundItem( 0.28125, 0.3125 )
    },
    "can_orange_1" : {
        "src": "Can_Z2.png",
        ...getBackgroundItem( 0.28125, 0.3125 )
    },
    "chair_red_cushion" :{
        "src": "chair_red_cushion.png",
        ...ONE_BLOCK_SPRITE
    },
    "computer_table" : {
        "src": "computer_table.png",
        ...getTwoHighSprite( false )
    },
    "Couch_Blue" : {
        "src": "couch.png",
        ...THREE_HIGH_SPRITE
    },
    "couch_nice_left" : {
        "src": "couch_nice_left.png",
        ...THREE_HIGH_SPRITE
    },
    "couch_nice_right" : {
        "src": "couch_nice_right.png",
        ...THREE_HIGH_SPRITE
    },
    "couch_yello" : {
        "src": "couch_yello.png",
        ...THREE_HIGH_SPRITE
    },
    "cover" : {
        "src": "cover.png",
        ...getBackgroundItem( 0.8125, 0.78125 )
    },
    "crisps": { 
        "src": "crisps.png",
        ...getBackgroundItem( 0.5, 0.46875 )
    },
    "detail": { 
        "src": "detail.png",
        ...getBackgroundItem( 3.71875, 0.28125 )
    },
    "detail_door_top_left": { 
        "src": "detail_Z2.png",
        ...getBackgroundItem( 0.3125, 0.78125 )
    },
    "detail_door_top_right": { 
        "src": "detail_Z3.png",
        ...getBackgroundItem( 0.3125, 0.78125 )
    },
    "door_1": {
        "src": "Door_Z1.png",
        ...getDoorOrWindow( 1, 1.625 )
    },
    "door_2": {
        "src": "Door_Z2.png",
        ...getDoorOrWindow( 1, 1.8125 )
    },
    "door_3": {
        "src": "Door_Z3.png",
        ...getDoorOrWindow( 1, 1.75 )
    },
    "door_4": {
        "src": "Door_Z4.png",
        ...getDoorOrWindow( 1, 1.625 )
    },
    "door_5": {
        "src": "Door_Z5.png",
        ...getDoorOrWindow( 1.96875, 2.84375 )
    },
    "door_6": {
        "src": "Door_Z6.png",
        ...getDoorOrWindow( 1.96875, 2.4375 )
    },
    "door_7": {
        "src": "Door_Z7.png",
        ...getDoorOrWindow( 1.875, 2.09375 )
    },
    "Fire_Hydrant" :{
        "src": "fire_hydrant.png",
        ...ONE_BLOCK_SPRITE
    },
    "Fridge" : {
        "src": "Fridge.png",
        ...getTwoHighSprite( false )
    },
    "funz": { 
        "src": "funz.png",
        ...getBackgroundItem( 2.375, 1.46875 )
    },
    "gang_z": { 
        "src": "gang_z.png",
        ...getBackgroundItem( 3.46875, 1.6875 )
    },
    "gate_left" : {
        "src": "gate_left.png",
        ...ONE_BLOCK_SPRITE
    },
    "gate_right" : {
        "src": "gate_right.png",
        ...ONE_BLOCK_SPRITE
    },
    "graff_z1": { 
        "src": "graff_z1.png",
        ...getBackgroundItem( 1.3125, 1.125 )
    },
    "hotel_sign" : {
        "src": "hotel_sign.png",
        ...getSignData( 2.21875 )
    },
    "house_plant" : {
        "src": "house_plant.png",
        ...getTwoHighSprite( false )
    },
    "inside_bin" : {
        "src": "inside_bin.png",
        ...ONE_BLOCK_SPRITE
    },
    "lamp_red" : {
        "src": "lamp_red.png",
        ...getTwoHighSprite( true )
    },
    "Lamppost_1" : {
        "src": "lamppost.png",
        "dimensional_alignment": "STANDARD",
        "grounded_at_bottom": true,
        "height_blocks": 5,
        "width_blocks": 1,
    },
    "newspaper_trash": { 
        "src": "newspaper.png",
        ...getBackgroundItem( 0.625, 0.4375 )
    },
    "no_entry_sign": { 
        "src": "no_entry.png",
        "dimensional_alignment": "STANDARD",
        "grounded_at_bottom": true,
        "height_blocks": 1.375,
        "width_blocks": 2,
    },
    "office_chair" : {
        "src": "office_chair.png",
        ...getTwoHighSprite( false )
    },
    "phone_table" : {
        "src": "phone_table.png",
        ...ONE_BLOCK_SPRITE
    },
    "pillar_round_bottom_shaft": { 
        "src": "pillar_z1.png",
        ...getGroundedAtBottom( 0.59375, 2.59375 )
    },
    "pillar_round_whole" : {
        "src": "pillar_z2.png",
        ...getGroundedAtBottom( 0.59375, 3.03125 )
     },
    "pillar_round_top_shaft": {
        "src": "pillar_z3.png",
        ...getGroundedAtBottom( 0.59375, 1.4375 )
     },
    "pillar_round_top_peak": {
        "src": "pillar_z4.png",
        ...getGroundedAtBottom( 0.59375, 0.4375 )
     },
    "pillar_square_bottom_shaft": {
        "src": "pillar_z6.png",
        ...getGroundedAtBottom( 0.59375, 1.5 )
     },
    "pillar_square_whole" : { 
        "src": "pillar_z5.png",
        ...getGroundedAtBottom( 0.59375, 2.875 )
    },
    "pillar_square_top_shaft": { 
        "src": "pillar_z7.png",
        ...getGroundedAtBottom( 0.59375, 1.4375 )
    },
    "pillar_square_middle_shaft": { 
        "src": "pillar_z8.png",
        ...getGroundedAtBottom( 0.59375, 1.46875 )
    },
    "plant_yo" : {
        "src": "plant_yo.png",
        ...getTwoHighSprite( false )
    },
    "plants" : {
        "src": "plants.png",
        ...getTwoHighSprite( false )
    },
    "pot_plant_a" : {
        "src": "pot_plant_a.png",
        ...ONE_BLOCK_SPRITE
    },
    "Poster_Cruise" : {
        "src": "poster1.png",
        ...POSTER_SPRITE
    },
    "Poster_Cola" : {
        "src": "poster2.png",
        ...POSTER_SPRITE
    },
    "Poster_Gronk" : {
        "src": "poster3.png",
        ...POSTER_SPRITE
    },
    "Rug_01" : { 
        "src": "rug01.png",
        "dimensional_alignment": "STANDARD",
        "on_background": true,
        ...getBackgroundItem( 3, 4 )
    },
    "rug_boo" : { 
        "src": "rug_boo.png",
        ...getBackgroundItem( 3, 2 )
    },
    "rug_g1" : { 
        "src": "rug_g1.png",
        ...getBackgroundItem( 2, 2 )
    },
    "rug_g2" : { 
        "src": "rug_g2.png",
        ...getBackgroundItem( 2, 2 )
    },
    "shop_cupboard_a" : {
        "src": "shop_cupboard_a.png",
        ...STANDARD_SHELVE
    },
    "shop_front": { 
        "src": "Shop_front_Z1.png",
        ...getBackgroundItem( 2.53125, 2.375 )
    },
    "shop_shelves_a" : {
        "src": "shop_shelves_a.png",
        ...STANDARD_SHELVE
    },
    "shop_shelves_b" : {
        "src": "shop_shelves_b.png",
        ...STANDARD_SHELVE
    },
    "shop_window": { 
        "src": "shop_window.png",
        ...getBackgroundItem( 3.53125, 1.96875 )
    },
    "Sign_01" : {
        "src": "sign1.png",
        ...getSignData( 1.75 )
    },
    "Sign_02" : {
        "src": "sign2.png",
        "dimensional_alignment": "STANDARD",
        ...getSignData( 1.75 )
    },
    "Sign_03" : {
        "src": "sign3.png",
        "dimensional_alignment": "STANDARD",
        ...getSignData( 1 )
    },
    "Sign_04" : {
        "src": "sign4.png",
        "dimensional_alignment": "STANDARD",
        ...getSignData( 1 )
    },
    "Single_Bed" : { 
        "src": "single_bed.png",
        ...getTwoHighSprite( false )
    },
    "Sink" : { 
        "src": "sink.png",
        ...THREE_HIGH_SPRITE
    },
    "Small_Table" : {
        "src": "small_table.png",
        ...ONE_BLOCK_SPRITE
    },
    "tires_1" : {
        "src": "Tires_Z1.png",
        "dimensional_alignment": "STANDARD",
        "width_blocks": 0.84375, 
        "height_blocks": 0.90625 
    },
    "tires_2" : {
        "src": "Tires_Z2.png",
        "dimensional_alignment": "STANDARD",
        "width_blocks": 0.78125, 
        "height_blocks": 0.6875
    },
    "trash_1" : {
        "src": "Trash_Z1.png",
        ...getBackgroundItem( 0.375, 0.28125 )
    },    
    "trash_2" : {
        "src": "Trash_Z2.png",
        ...getBackgroundItem( 0.40625, 0.21875 )
    },    
    "trash_3" : {
        "src": "Trash_Z3.png",
        ...getBackgroundItem( 0.46875, 0.3125 )
    },    
    "trash_4" : {
        "src": "Trash_Z4.png",
        ...getBackgroundItem( 0.5625, 0.53125 )
    },    
    "vent_1" : {
        "src": "Vent_Z1.png",
        ...getBackgroundItem( 0.65625, 0.40625 )
    },  
    "vent_2" : {
        "src": "Vent_Z2.png",
        ...getBackgroundItem( 0.46875, 0.375 )
    },   
    "vent_3" : {
        "src": "Vent_Z3.png",
        ...getBackgroundItem( 0.84375, 0.8125 )
    },
    "vent_4" : {
        "src": "Vent_Z4.png",
        ...getBackgroundItem( 0.84375, 0.8125 )
    },    
    "vent_5" : {
        "src": "Vent_Z5.png",
        ...getBackgroundItem( 0.65625, 0.5625 )
    },    
    "water_puddle": {
        "src": "water_puddle.png",
        ...getBackgroundItem( 1, 1 )
    },
    "wheelie_bin_left": {
        "src": "wheelie_bin_Z1.png",
        "dimensional_alignment": "STANDARD",
        "width_blocks": 1.25, 
        "height_blocks": 1.9375
    },
    "wheelie_bin_right": {
        "src": "wheelie_bin_Z2.png",
        "dimensional_alignment": "STANDARD",
        "width_blocks": 1.25, 
        "height_blocks": 1.9375
    },
    "window_1": {
        "src": "Window_Z1.png",
        ...getDoorOrWindow( 1, 1.0625 )
    },
    "window_2": {
        "src": "Window_Z2.png",
        ...getDoorOrWindow( 1, 1.15625 )
    },
    "window_3": {
        "src": "Window_Z3.png",
        ...getDoorOrWindow( 1, 1.15625 )
    },
    "window_4": {
        "src": "Window_Z4.png",
        ...getDoorOrWindow( 1.59375, 1.15625 )
    },
    "window_5": {
        "src": "Window_Z5.png",
        ...getDoorOrWindow( 1, 1.15625 )
    },
    "window_6": {
        "src": "Window_Z6.png",
        ...getDoorOrWindow( 1, 1.15625 )
    },
    "window_7": {
        "src": "Window_Z7.png",
        ...getDoorOrWindow( 1.15625, 1 )
    },
    "window_8": {
        "src": "Window_Z8.png",
        ...getDoorOrWindow( 2.3125, 1.78125 )
    },
    "window_9": {
        "src": "Window_Z9.png",
        ...getDoorOrWindow( 1.15625, 1.3125 )
    },
    "window_10": {
        "src": "Window_Z10.png",
        ...getDoorOrWindow( 1, 1.3125 )
    },
    "yellow_chair" : {
        "src": "yellow_chair.png",
        ...STANDARD_SHELVE
    },
    "yellow_lamp" : {
        "src": "yellow_lamp.png",
        ...getTwoHighSprite( true )
    },
    "yellow_rug_a" : { 
        "src": "yellow_rug_a.png",
        ...getBackgroundItem( 4, 3 )
    },
    "yellow_rug_a" : { 
        "src": "yellow_rug_a.png",
        ...getBackgroundItem( 3, 2 )
    },
    "yellow_stand" : { 
        "src": "yellow_stand.png",
        ...ONE_BLOCK_SPRITE
    },
    "yum_mart_sign": {
        "src": "yum_mart.png",
        ...getBackgroundItem( 3.46875, 0.65625 )
    },
    // cars
    "car_a" : {
        "src": "car_a.png",
        ...STANDARD_CAR
    },
    "car_b" : {
        "src": "car_b.png",
        ...STANDARD_CAR
    },
    "car_c" : {
        "src": "car_c.png",
        ...STANDARD_CAR
    },
    "car_d" : {
        "src": "car_d.png",
        ...STANDARD_CAR
    },
    "bus" : {
        "src": "bus.png",
        ...BUS
    }
}

const getDoorsAndWindows = ( ) => {
    let returner = { } 
    Object.keys( spriteData ).forEach( ( e ) => { 
        let object = spriteData[e]
        object.key = e;
        if ( object.door_or_window )
            returner[e] = object
    })
    return returner;
}

const getBackgroundItems = ( ) => {
    let returner = { } 
    Object.keys( spriteData ).forEach( ( e ) => { 
        let object = spriteData[e]
        object.key = e;
        if ( !object.door_or_window && object.on_background )
            returner[e] = object
    })
    return returner;
}

const getGroundedAtBottomItems = ( ) => {
    let returner = { } 
    Object.keys( spriteData ).forEach( ( e ) => { 
        let object = spriteData[e]
        object.key = e;
        if ( object.grounded_at_bottom )
            returner[e] = object
    })
    return returner;
}

const getNotGroundedItems = ( ) => {
    let returner = { } 
    Object.keys( spriteData ).forEach( ( e ) => { 
        let object = spriteData[e]
        object.key = e;
        if ( object.not_grounded )
            returner[e] = object
    })
    return returner;
}

const getCars = ( ) => {
    let returner = { } 
    Object.keys( spriteData ).forEach( ( e ) => { 
        let object = spriteData[e]
        object.key = e;
        if ( object.isCar )
            returner[e] = object
    })
    return returner;
}

const getRestItems = ( ) => {
    let returner = { } 
    Object.keys( spriteData ).forEach( ( e ) => { 
        let object = spriteData[e]
        object.key = e;
        if ( !object.not_grounded && !object.grounded_at_bottom && !object.door_or_window && !object.on_background && !object.isCar )
            returner[e] = object
    })
    return returner;
}