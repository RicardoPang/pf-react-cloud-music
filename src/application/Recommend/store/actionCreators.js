// 放不同action的地方
import * as actionTypes from './constants';
import { fromJS } from 'immutable'; // 将 JS 对象转换成 immutable 对象
import {
  getBannerRequest,
  getRecommendListRequest,
} from '../../../api/request';

export const changeBannerList = (data) => ({
  type: actionTypes.CHANGE_BANNER,
  data: fromJS(data),
});

export const changeRecommendList = (data) => ({
  type: actionTypes.CHANGE_RECOMMEND_LIST,
  data: fromJS(data),
});

export const changeEnterLoading = (data) => ({
  type: actionTypes.CHANGE_ENTER_LOADING,
  data,
});

export const getBannerList = () => {
  return async (dispatch) => {
    try {
      const data = await getBannerRequest();
      dispatch(changeBannerList(data.banners));
    } catch (err) {
      console.log('轮播图数据传输错误', err);
    }
  };
};

export const getRecommendList = () => {
  return async (dispatch) => {
    try {
      const data = await getRecommendListRequest();
      dispatch(changeRecommendList(data.result));
      dispatch(changeEnterLoading(false));
    } catch (err) {
      console.log('推荐歌单数据传输错误', err);
      dispatch(changeEnterLoading(false));
    }
  };
};
