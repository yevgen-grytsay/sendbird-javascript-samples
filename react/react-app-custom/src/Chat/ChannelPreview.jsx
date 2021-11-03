import React, {useEffect} from 'react';

import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {sendBirdSelectors, withSendBird} from "sendbird-uikit";


const Status = (props) => {
    console.log('Stastus props', props);
    const {members, sdk} = props;
    const membersStr = members.map(c => c.nickname || c.userId).join(', ');



    useEffect(() => {
        let timer = null;
        const listQuery = sdk.createApplicationUserListQuery();
        // listQuery.userIdsFilter = ['Jeff'];
        listQuery.userIdsFilter = members.map(c => c.userId);
        let onComplete = function(users, error) {
            if (error) {
                console.log('listQuery error', error);
                // Handle error.
            }

            // users[0] = 'Jeff'
            // console.log('listQuery ok', users);
            if (users[0].connectionStatus === sdk.User.ONLINE) {
                // 'Jeff' is currently online.
                // User.connectionStatus consists of NON_AVAILABLE, ONLINE, and OFFLINE.
                // console.log('listQuery online', error);
            }

            const otherMembers = users.filter(u => u.userId !== sdk.getCurrentUserId());
            console.log('other members status', {[otherMembers[0].nickname]: otherMembers[0].connectionStatus});


            timer = setTimeout(() => {
                const listQuery = sdk.createApplicationUserListQuery();
                // listQuery.userIdsFilter = ['Jeff'];
                listQuery.userIdsFilter = members.map(c => c.userId);
                listQuery.next(onComplete);
            }, 5000);
        };
        listQuery.next(onComplete);

        return function () {
            clearTimeout(timer);
        };
    }, []);

    return <div>Status: {membersStr}</div>
};

const StatusWithSendbird = withSendBird(Status, (state) => {
    const sdk = sendBirdSelectors.getSdk(state)

    return {sdk};
})

export default function ChannelPreview({ channel, onLeaveChannel }) {
  return (
    <Paper variant="outlined" style={{ display: 'flex' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
        <CardContent style={{ flex: '1 0 auto', minWidth: 180 }}>
          <Typography component="h5" variant="h5">
            {channel.name
             || channel.members.map(c => c.nickname || c.userId).join(', ').slice(0, 10).concat('...')
            }
          </Typography>
            <StatusWithSendbird members={channel.members} />
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
        }
        style={{ width: 151 }}
        title={channel.url}
      />
    </Paper>
  )
}
