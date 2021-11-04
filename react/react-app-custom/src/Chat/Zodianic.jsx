import React from "react";
import {useReducer, useEffect} from "react";
import {sendBirdSelectors, useSendbirdStateContext} from "sendbird-uikit";


export const ZodianicDispatch = React.createContext(null);

const reducer = function (state, action) {
    switch (action.type) {
        case 'add':
            return {
                ...state,
                subscribeToIds: [
                    ...state.users
                        .filter(u => u.userId !== action.payload.userId)
                        .map(u => u.userId),
                    action.payload.userId,
                ]
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

    // const context = useSendbirdStateContext()
    // const sdk = sendBirdSelectors.getSdk(context)

    useEffect(() => {
        console.log('user list updated', store.users);
    }, [store.users]);

    // useEffect(() => {
    //     let timer = null;
    //     const listQuery = sdk.createApplicationUserListQuery();
    //     // listQuery.userIdsFilter = ['Jeff'];
    //     listQuery.userIdsFilter = userList.map(c => c.userId);
    //     let onComplete = function(users, error) {
    //         if (error) {
    //             console.log('listQuery error', error);
    //             // Handle error.
    //         }
    //
    //         // users[0] = 'Jeff'
    //         // console.log('listQuery ok', users);
    //         if (users[0].connectionStatus === sdk.User.ONLINE) {
    //             // 'Jeff' is currently online.
    //             // User.connectionStatus consists of NON_AVAILABLE, ONLINE, and OFFLINE.
    //             // console.log('listQuery online', error);
    //         }
    //
    //         const otherMembers = users.filter(u => u.userId !== sdk.currentUser.userId);
    //         console.log('other members status', {[otherMembers[0].nickname]: otherMembers[0].connectionStatus});
    //
    //
    //         timer = setTimeout(() => {
    //             const listQuery = sdk.createApplicationUserListQuery();
    //             // listQuery.userIdsFilter = ['Jeff'];
    //             listQuery.userIdsFilter = userList.map(c => c.userId);
    //             listQuery.next(onComplete);
    //         }, 5000);
    //     };
    //     listQuery.next(onComplete);
    //
    //     return function () {
    //         clearTimeout(timer);
    //     };
    // }, []);

    return (
        <ZodianicDispatch.Provider value={{dispatch, userList: store.users}}>
            {children}
        </ZodianicDispatch.Provider>
    );
//  const dispatch = useContext(ZodianicDispatch);
};