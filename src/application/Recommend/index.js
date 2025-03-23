import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { forceCheck } from 'react-lazyload';
import * as actionTypes from './store/actionCreators';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/scroll';
import Loading from '../../baseUI/loading';
import { Content } from './style';
import { renderRoutes } from 'react-router-config';

function Recommend(props) {
  const { bannerList, recommendList, enterLoading, songsCount } = props;
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

  useEffect(() => {
    if (!bannerList.size) {
      getBannerDataDispatch();
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch();
    }
  }, []);

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];

  return (
    <Content play={songsCount}>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS} />
          <RecommendList recommendList={recommendListJS} />
        </div>
      </Scroll>
      {enterLoading ? <Loading /> : null}
      {/* 将目前所在路由的下一层子路由加以渲染 */}
      {renderRoutes(props.route.routes)}
    </Content>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  // 不要在这里将数据 toJS
  // 不然每次diff比对props的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用immutable
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn(['recommend', 'enterLoading']),
  songsCount: state.getIn(['player', 'playList']).size, // 播放列表的歌曲数量，尽量建设toJS操作，直接取size属性就代表了list的长度
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    },
  };
};

// 将ui组件包装秤容器组件
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Recommend));
