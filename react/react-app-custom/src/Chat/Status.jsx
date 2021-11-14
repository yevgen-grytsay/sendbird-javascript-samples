import React, {useEffect, useContext, useState} from 'react';
import {sendBirdSelectors, useSendbirdStateContext} from "sendbird-uikit";
import {ZodianicDispatch} from "./Zodianic";


export default function Status(props) {
    const {members} = props;

    const context = useSendbirdStateContext()
    const sdk = sendBirdSelectors.getSdk(context)

    const otherMember = members.find(c => c.userId !== sdk.currentUser.userId)

    const {dispatch, userList} = useContext(ZodianicDispatch);
    useEffect(() => {
        console.log('register user', otherMember);
        dispatch({type: 'add', payload: otherMember});
    }, []);

    const [isOnline, setOnline] = useState(false);
    const thisUser = userList.find(u => u.userId === otherMember.userId);
    useEffect(() => {
        if (thisUser) {
            setOnline(thisUser.connectionStatus === sdk.User.ONLINE)
        }
    }, [thisUser]);

    const status = isOnline
        ? (<div style={{backgroundColor: 'green'}}>Online</div>)
        : (<div style={{backgroundColor: 'grey'}}>Offline</div>)

    return status
};
