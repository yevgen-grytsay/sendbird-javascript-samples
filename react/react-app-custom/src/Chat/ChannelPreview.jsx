import React from 'react';

import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import {sendBirdSelectors, useSendbirdStateContext} from "sendbird-uikit";
// import Status from './Status';
import Status2 from './Status2';
import {Badge} from "@material-ui/core";


const getChannelUnreadMessageCount = (channel) => (
    (channel && channel.unreadMessageCount)
        ? channel.unreadMessageCount
        : 0
);

const ChannelPreview = function ({ channel }) {
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
                    <Status2 members={channel.members} />
                </CardContent>
                <div className={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                </div>
            </div>
            {
                getChannelUnreadMessageCount(channel)
                    ? <Badge count={getChannelUnreadMessageCount(channel)} />
                    : null
            }
        </Paper>
    )
};


export default ChannelPreview;
