const FAT_FEDORA_GUY = "FAT FEDORA GUY";
const TOUGH_GUY = "TOUGH GUY";
const SUNGLASSES_LADY = "SUNGLASSES LADY";
const GRANNY = "GRANNY";
const TOUGH_GUY_WITH_COOL_HAIR = "TOUGH GUY WITH COOL HAIR";
const PIGEON = "PIGEON";
const BUSINESS_MAN = "BUSINESS MAN";
const STRONG_GUY = "STRONG GUY";
const BURLY_GUY = "BURLY GUY";
const GREEN_SHIRTED_STRONG_GUY = "GREEN SHIRTED STRONG GUY";
const DORKY_GUY = "DORKY GUY";
const TOUGH_GUY_WITH_DARK_HAIR = "TOUGH GUY WITH DARK HAIR";
const TOUGH_GUY_WITH_COOL_SHIRT = "TOUGH GUY WITH COOL SHIRT";
const FAT_BUFF_GUY = "FAT BUFF GUY";
const BALD_BEER_BELLY_GUY = "BALD BEER BELLY GUY";
const BLONDE_BEER_BELLY_GUY = "BLONDE BEER BELLY GUY";
const PINK_HAIRED_FAT_GUY = "PINK HAIRED FAT GUY";
const YELLOW_SHIRT_LADY = "YELLOW SHIRT LADY";
const GREEN_HAIR_LADY = "GREEN HAIR LADY";
const SUPERMARKET_MANAGER = "SUPERMARKET MANAGER";
const MONKEY_CEO = "MONKEY CEO";
const WHITE_PONY_TAIL_LADY = "WHITE PONY TAIL LADY";
const BLACK_PONY_TAIL_LADY = "BLACK PONY TAIL LADY";
const ROBOT = "ROBOT";
const PINK_HAIR_NERD_LADY = "PINK HAIR NERD LADY";
const BLONDE_NERD_LADY = "BLONDE NERD LADY";
const DARK_HAIR_NERD_LADY = "DARK HAIR NERD LADY";

const getProfileName = ( pngName ) => {
    switch( pngName ) {
        case "neckbeard.png":
            return FAT_FEDORA_GUY;
        case 'chad.png': 
            return TOUGH_GUY;
        case 'woman.png': 
            return SUNGLASSES_LADY;
        case 'characterx3.png': 
            return GRANNY;
        case 'characterx5.png': 
            return TOUGH_GUY_WITH_COOL_HAIR;
        case 'pigeon.png': 
            return PIGEON;
        case 'business_man.png':
            return BUSINESS_MAN;
        case 'chad_recolour01.png':
            return STRONG_GUY;
        case 'chad_recolour02.png':
            return BURLY_GUY;
        case 'chad_recolour03.png':
            return GREEN_SHIRTED_STRONG_GUY;
        case 'character_x1_recolour01.png':
            return DORKY_GUY;
        case 'character_x4.png':
            return TOUGH_GUY_WITH_DARK_HAIR;
        case 'character_x5_recolour.png':
            return TOUGH_GUY_WITH_COOL_SHIRT;
        case 'fats.png':
            return FAT_BUFF_GUY;
        case 'generic_balding_guy.png':
            return BALD_BEER_BELLY_GUY;
        case 'generic_blonde_guy.png':
            return BLONDE_BEER_BELLY_GUY;
        case 'fats_recolour.png':
            return PINK_HAIRED_FAT_GUY;
        case 'new_girl.png':
            return YELLOW_SHIRT_LADY;
        case 'new_girl_recolour.png':
            return GREEN_HAIR_LADY;
        case 'manager.png':
            return SUPERMARKET_MANAGER;
        case 'monkey_ceo.png':
            return MONKEY_CEO;
        case 'pony_tail.png':
            return WHITE_PONY_TAIL_LADY;
        case 'pony_tail_recolour.png':
            return BLACK_PONY_TAIL_LADY;
        case 'robot.png':
            return ROBOT;
        case 'tumbler_girl.png':
            return PINK_HAIR_NERD_LADY;
        case 'tumbler_girl_recolour01.png':
            return BLONDE_NERD_LADY;
        case 'tumbler_girl_recolour02.png':
            return DARK_HAIR_NERD_LADY;
    }
}