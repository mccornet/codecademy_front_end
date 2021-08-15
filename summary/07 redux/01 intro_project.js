const initialWagonState = {
    supplies: 100,
    distance: 0,
    days: 0
}

const gameReducer = (state = initialWagonState, action) => {
    switch(action.type) {

        case 'gather': {
            return {
                ...state,
                days: state.days + 1,
                supplies: state.supplies + 15
            };
        }

        case 'travel': {
            const days_travelled = +action.payload
            if(state.supplies - 20*days_travelled < 0 ) {
                return state;
            }

            return {
                ...state,
                days: state.days + days_travelled,
                distance: state.distance + 10*days_travelled,
                supplies: state.supplies - 20*days_travelled
            };
        }

        case 'tippedWagon': {
            return {
            ...state,
            supplies: state.supplies - 30,
            days: state.days + 1
            }
        }

        default: {
            return state;
        }
    }
}

let wagon = gameReducer(undefined, {});
console.log(wagon);
wagon = gameReducer(wagon, {type: 'travel', payload: 1});
console.log(wagon);
wagon = gameReducer(wagon, {type: 'gather'});
console.log(wagon);
wagon = gameReducer(wagon, {type: 'tippedWagon'});
console.log(wagon);
wagon = gameReducer(wagon, {type: 'travel', payload: 3});
console.log(wagon);
wagon = gameReducer(wagon, {type: 'travel', payload: 3});
console.log(wagon);
  