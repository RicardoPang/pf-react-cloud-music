import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getRankList } from './store/index';
import Loading from '../../baseUI/loading';
import { List, ListItem, SongList, Container } from './style';
import Scroll from '../../baseUI/scroll/index';
import { EnterLoading } from './../Singers/style';
import { filterIndex } from '../../api/utils';
import { renderRoutes } from 'react-router-config';

function Rank(props) {
  const { rankList: list, loading, songsCount } = props;

  const { getRankListDataDispatch } = props;

  let rankList = list ? list.toJS() : [];

  useEffect(() => {
    if (!rankList.length) {
      getRankListDataDispatch();
    }
    // eslint-disable-next-line
  }, []);

  let globalStartIndex = filterIndex(rankList);
  let officialList = rankList.slice(0, globalStartIndex);
  let globalList = rankList.slice(globalStartIndex);

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {list.map((item, index) => {
          return (
            <li key={index + item.first}>
              {`${index + 1}. ${item.first}`}
              <span className="singer">
                {item.second ? ` - ${item.second}` : ''}
              </span>
            </li>
          );
        })}
      </SongList>
    ) : null;
  };

  // 跳转到排行榜详情页
  const enterDetail = (detail) => {
    props.history.push(`/rank/${detail.id}`);
  };

  // 这是渲染榜单列表函数，传入 global 遍历来区分不同的布局方式
  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {list.map((item) => {
          return (
            <ListItem
              key={item.id}
              tracks={item.tracks}
              onClick={() => enterDetail(item)}
            >
              <div className="img_wrapper">
                <img src={item.coverImgUrl} alt={item.name} />
                <span className="update_frequency">{item.updateFrequency}</span>
              </div>
              {renderSongList(item.tracks)}
            </ListItem>
          );
        })}
      </List>
    );
  };

  // 榜单数据未加载出来之前都给隐藏
  let displayStyle = loading ? { display: 'none' } : { display: '' };

  return (
    <Container play={songsCount}>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>
            官方榜
          </h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>
            全球榜
          </h1>
          {renderRankList(globalList, true)}
        </div>
      </Scroll>
      {loading ? (
        <EnterLoading>
          <Loading></Loading>
        </EnterLoading>
      ) : null}
      {renderRoutes(props.route.routes)}
    </Container>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading']),
  songsCount: state.getIn(['player', 'playList']).size,
});
// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getRankListDataDispatch() {
      dispatch(getRankList());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));
