// 存放initialStore和reducer函数
import * as actionTypes from './constants';
import { fromJS } from 'immutable'; // 这里用到 fromJS 把 JS 数据结构转化成 immutable 数据结构

const defaultState = fromJS({
  enterLoading: false,
  currentAlbum: {},
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CURRENT_ALBUM:
      return state.set('currentAlbum', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    default:
      return state;
  }
};
