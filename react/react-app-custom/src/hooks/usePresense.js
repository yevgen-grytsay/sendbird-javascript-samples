import React, {useEffect, useReducer, useState} from "react";
import {sendBirdSelectors, useSendbirdStateContext} from "sendbird-uikit";


const state = {
  watchList: [],
};

let sdk;

const addToWatchList = ({userId, setOnline}) => {

  const watcherIndex = state.watchList.findIndex(w => w.userId === userId);
  if (watcherIndex === -1) {
    state.watchList = [
      ...state.watchList,
      {userId, setOnline},
    ];
    console.log('addToWatchList add', userId);

    return;
  }

  if (state.watchList[watcherIndex].setOnline === setOnline) {
    console.log('addToWatchList skip', userId);

    return;
  }

  state.watchList = [
    ...state.watchList.slice(0, watcherIndex),
    ...state.watchList.slice(watcherIndex + 1),
    {userId, setOnline},
  ];
  console.log('addToWatchList update', userId);
};

let timer = setInterval(() => {
  console.log('sdk', sdk);

  if (!sdk || !sdk.createApplicationUserListQuery) {
    console.warn('sdk not initialized');

    return;
  }

  if (state.watchList.length === 0) {
    console.warn('no users registered to track');

    return;
  }


  const userIdList = state.watchList.map(({userId}) => userId);
  console.warn('users registered to track: ', userIdList);

  const listQuery = sdk.createApplicationUserListQuery();
  listQuery.userIdsFilter = userIdList;
  listQuery.next(function (users, error) {
    if (error) {
      console.log('listQuery error', error);
      // Handle error.
    } else {
      console.log('listQuery ok', users);
      // userList = users;

      users.forEach(user => {
        const watcher = state.watchList.find(w => w.userId === user.userId);
        if (watcher) {
          watcher.setOnline(user.connectionStatus === sdk.User.ONLINE);
        } else {
          console.warn('user not found in watcher list', user, state.watchList);
        }
      });
    }
  });

}, 10000);


export default function usePresence(userId) {

  const [isOnline, setOnline] = useState(null);

  addToWatchList({userId, setOnline});


  const context = useSendbirdStateContext();
  const thisSdk = sendBirdSelectors.getSdk(context);

  useEffect(() => {
    console.log('useEffect inside usePresence mounted', userId);

    if (!sdk) {
      sdk = thisSdk;
    }

    return () => {
      console.log('useEffect inside usePresence unmounted', userId);
    };
  }, [sdk]);

  return isOnline;
}
