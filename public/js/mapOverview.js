const stopMapOverviewScroll = ( ) => {
    IS_OVERVIEW_SCROLL_ACTIVE = false;
}

const initMapOverviewScrollOnClick = ( event ) => {
    IS_OVERVIEW_SCROLL_ACTIVE = true;
    OVERVIEW_SCROLL_X_COUNTER = event.pageX - OVERVIEW_CANVAS_WRAPPER.offsetLeft;
    OVERVIEW_SCROLL_LEFT = OVERVIEW_CANVAS_WRAPPER.scrollLeft;    
}

const mapOverviewHorizontalScroll = ( event ) => {
    const x = event.pageX - OVERVIEW_CANVAS_WRAPPER.offsetLeft;
    const step = x - OVERVIEW_SCROLL_X_COUNTER;
    OVERVIEW_CANVAS_WRAPPER.scrollLeft = scrollLeft - step;
    OVERVIEW_INFO_WRAPPER.scrollLeft = scrollLeft - step;
    OVERVIEW_BUTTONS_WRAPPER.scrollLeft = scrollLeft - step;
}