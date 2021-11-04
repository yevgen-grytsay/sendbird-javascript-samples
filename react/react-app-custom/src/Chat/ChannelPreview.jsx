import React, {useEffect, useContext, useState} from 'react';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {sendBirdSelectors, useSendbirdStateContext} from "sendbird-uikit";
import {ZodianicDispatch} from "./Zodianic";


const Status = (props) => {
    // console.log('Status props', props);
    const {members} = props;

    const context = useSendbirdStateContext()
    const sdk = sendBirdSelectors.getSdk(context)

    const otherMember = members.find(c => c.userId !== sdk.currentUser.userId)
    // const membersStr = members.map(c => c.nickname || c.userId).join(', ');

    const {dispatch, userList} = useContext(ZodianicDispatch);

    useEffect(() => {
        console.log('register user', otherMember);
        dispatch({type: 'add', payload: otherMember});
    }, []);

    // useEffect(() => {
    //     let timer = null;
    //     const listQuery = sdk.createApplicationUserListQuery();
    //     // listQuery.userIdsFilter = ['Jeff'];
    //     listQuery.userIdsFilter = members.map(c => c.userId);
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
    //             listQuery.userIdsFilter = members.map(c => c.userId);
    //             listQuery.next(onComplete);
    //         }, 5000);
    //     };
    //     listQuery.next(onComplete);
    //
    //     return function () {
    //         clearTimeout(timer);
    //     };
    // }, []);

    const [isOnline, setOnline] = useState(false);
    const thisUser = userList.find(u => u.userId === otherMember.userId);
    useEffect(() => {
        if (!thisUser) {
            console.log('user not found', {
                userList,
                otherMember
            })

            return;
        }

        setOnline(thisUser.connectionStatus === sdk.User.ONLINE)
    }, [thisUser]);

    const status = isOnline
        ? (<div style={{backgroundColor: 'green'}}>Online</div>)
        : (<div style={{backgroundColor: 'grey'}}>Offline</div>)

    return status
};

// const StatusWithSendbird = withSendBird(Status, (state) => {
//     const sdk = sendBirdSelectors.getSdk(state)
//
//     return {sdk};
// })

const ChannelPreview = function ({ channel, onLeaveChannel }) {
    const context = useSendbirdStateContext()
    const sdk = sendBirdSelectors.getSdk(context)

    let otherMember = channel.members.find(member => member.userId !== sdk.currentUser.userId);
    const channelName = otherMember.nickname;

    return (
        <Paper variant="outlined" style={{ display: 'flex' }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <CardContent style={{ flex: '1 0 auto', minWidth: 180 }}>
                    <Typography component="h5" variant="h5">
                        {channelName}
                    </Typography>
                    <Status members={channel.members} />
                </CardContent>
                <div className={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => onLeaveChannel(channel, () => {
                            alert(`Left channel: ${channel.url}`)
                        })}
                    >
                        Leave
                    </Button>
                </div>
            </div>
            <CardMedia
                image={
                    channel.coverUrl
                    || channel.members[0].profileUrl
                    || 'https://picsum.photos/50/50'
                }
                style={{ width: 151 }}
                title={channel.url}
            />
        </Paper>
    )
};


export default ChannelPreview;
