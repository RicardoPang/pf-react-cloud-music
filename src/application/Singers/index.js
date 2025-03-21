import React, { useEffect, useContext } from 'react';
import Horizen from '../../baseUI/horizen-item';
import { categoryTypes, alphaTypes } from '../../api/config';
import { CategoryDataContext } from './data';
import {
  NavContainer,
  ListContainer,
  List,
  ListItem,
  EnterLoading,
} from './style';
import {
  getSingerList,
  getHotSingerList,
  changeEnterLoading,
  changePageCount,
  refreshMoreSingerList,
  changePullUpLoading,
  changePullDownLoading,
  refreshMoreHotSingerList,
} from './store/actionCreators';
import LazyLoad, { forceCheck } from 'react-lazyload';
import Scroll from './../../baseUI/scroll/index';
import { connect } from 'react-redux';
import Loading from '../../baseUI/loading';
import { CHANGE_CATEGORY, CHANGE_ALPHA, Data } from './data';
import { withRouter } from 'react-router-dom';
import LoadingV2 from '../../baseUI/loading-v2';

const DEFAULT_AVATAR =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48Y2lyY2xlIGZpbGw9IiNFRUUiIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIvPjxwYXRoIGQ9Ik0zNiA2NWMyLjIgOC44IDEwIDIwIDI4IDIwIDE4IDAgMjUuOC0xMS4yIDI4LTIwIiBzdHJva2U9IiM5OTkiIHN0cm9rZS13aWR0aD0iMyIvPjxjaXJjbGUgZmlsbD0iIzk5OSIgY3g9IjM2IiBjeT0iNDIiIHI9IjQiLz48Y2lyY2xlIGZpbGw9IiM5OTkiIGN4PSI2NCIgY3k9IjQyIiByPSI0Ii8+PC9nPjwvc3ZnPg==';

function Singers(props) {
  const {
    singerList,
    enterLoading,
    pullUpLoading,
    pullDownLoading,
    pageCount,
  } = props;

  const {
    getHotSingerDispatch,
    updateDispatch,
    pullDownRefreshDispatch,
    pullUpRefreshDispatch,
  } = props;

  const { data, dispatch } = useContext(CategoryDataContext);

  const { category, alpha } = data.toJS();

  useEffect(() => {
    if (!singerList.size) {
      getHotSingerDispatch();
    }
    // eslint-disable-next-line
  }, []);

  let handleUpdateAlpha = (val) => {
    dispatch({ type: CHANGE_ALPHA, data: val });
    updateDispatch(category, val);
  };

  let handleUpdateCatetory = (val) => {
    dispatch({ type: CHANGE_CATEGORY, data: val });
    updateDispatch(val, alpha);
  };

  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, category === '', pageCount);
  };

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha);
  };

  const enterDetail = (id) => {
    props.history.push(`/singers/${id}`);
  };

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS() : [];
    return (
      <List>
        {list.map((item, index) => {
          return (
            <ListItem
              key={item.accountId + '' + index}
              onClick={() => enterDetail(item.id)}
            >
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={DEFAULT_AVATAR}
                      alt="singer"
                    />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300x300`}
                    width="100%"
                    height="100%"
                    alt={item.name}
                  />
                </LazyLoad>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <div>
      <Data>
        <NavContainer>
          <Horizen
            list={categoryTypes}
            title={'分类'}
            handleClick={handleUpdateCatetory}
            oldVal={category}
          />
          <Horizen
            list={alphaTypes}
            title={'首字母'}
            handleClick={handleUpdateAlpha}
            oldVal={alpha}
          />
        </NavContainer>
        <ListContainer>
          <Scroll
            pullUp={handlePullUp}
            pullDown={handlePullDown}
            pullUpLoading={pullUpLoading}
            pullDownLoading={pullDownLoading}
            onScroll={forceCheck}
          >
            {renderSingerList()}
          </Scroll>
          <div className="pull-up-loading">
            {pullUpLoading ? <Loading /> : null}
          </div>
          <div className="pull-down-loading">
            {pullDownLoading ? <LoadingV2 /> : null}
          </div>
        </ListContainer>
      </Data>
      {enterLoading ? (
        <EnterLoading>
          <Loading />
        </EnterLoading>
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => ({
  singerList: state.getIn(['singers', 'singerList']),
  enterLoading: state.getIn(['singers', 'enterLoading']),
  pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
  pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
  pageCount: state.getIn(['singers', 'pageCount']),
});
const mapDispatchToProps = (dispatch) => {
  return {
    getHotSingerDispatch() {
      dispatch(getHotSingerList());
    },
    updateDispatch(category, alpha) {
      dispatch(changePageCount(0));
      dispatch(changeEnterLoading(true));
      dispatch(getSingerList(category, alpha));
    },
    // 滑到最底部刷新部分的处理
    pullUpRefreshDispatch(category, alpha, hot, count) {
      dispatch(changePullUpLoading(true));
      dispatch(changePageCount(count + 1));
      if (hot) {
        dispatch(refreshMoreHotSingerList());
      } else {
        dispatch(refreshMoreSingerList(category, alpha));
      }
    },
    //顶部下拉刷新
    pullDownRefreshDispatch(category, alpha) {
      dispatch(changePullDownLoading(true));
      dispatch(changePageCount(0));
      if (category === '' && alpha === '') {
        dispatch(getHotSingerList());
      } else {
        dispatch(getSingerList(category, alpha));
      }
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Singers));
