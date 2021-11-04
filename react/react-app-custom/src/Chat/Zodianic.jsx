import React from "react";
import {useReducer, useEffect} from "react";
import {sendBirdSelectors, useSendbirdStateContext} from "sendbird-uikit";


export const ZodianicDispatch = React.createContext(null);

const reducer = function (state, action) {
    switch (action.type) {
        case 'add':

            const newIds = state.subscribeToIds;
            if (!newIds.includes(action.payload.userId)) {
                newIds.push(action.payload.userId);
            }
            console.log('add action', action, newIds);

            return {
                ...state,
                subscribeToIds: newIds
                // users: [
                //     ...state.users.filter(u => u.userId !== action.payload.userId),
                //     action.payload,
                // ],
            };
        case 'remove':
            return {
                ...state,
                subscribeToIds: state.users
                    .filter(u => u.userId !== action.payload.userId)
                    .map(u => u.userId),
            };
        case 'replace_users':
            return {
                ...state,
                users: action.payload,
            };
        default:
            throw new Error();
    }
};

export const ZodianicApp = ({children}) => {
    const [store, dispatch] = useReducer(
        reducer,
        {
            subscribeToIds: [],
            users: [],
        }
    );

    // useEffect(() => {
    //     console.log('user list updated', store.users);
    // }, [store.users]);
    const context = useSendbirdStateContext()
    const sdk = sendBirdSelectors.getSdk(context)

    useEffect(() => {
        let timer = setInterval(() => {
            console.log('sdk', sdk);

            if (!sdk || !sdk.createApplicationUserListQuery) {
                console.warn('sdk not initialized');

                return;
            }

            if (store.subscribeToIds.length === 0) {
                console.warn('no users registered to track');

                return;
            }


            console.warn('users registered to track: ', store.subscribeToIds);

            const listQuery = sdk.createApplicationUserListQuery();
            listQuery.userIdsFilter = store.subscribeToIds;
            listQuery.next(function (users, error) {
                if (error) {
                    console.log('listQuery error', error);
                    // Handle error.
                } else {
                    console.log('listQuery ok', users);
                    dispatch({type: 'replace_users', payload: users})
                }
            });

        }, 10000);

        return function () {
            clearInterval(timer);
        };
    }, [sdk]);

    return (
        <ZodianicDispatch.Provider value={{dispatch, userList: store.users}}>
            {children}
        </ZodianicDispatch.Provider>
    );
};