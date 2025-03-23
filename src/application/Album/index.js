//src/application/Album/index.js
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, ScrollContainer } from './style';
import { CSSTransition } from 'react-transition-group';
import Header from '../../baseUI/header/index';
import Scroll from '../../baseUI/scroll/index';
import { TopDesc, Menu, SongList, SongItem } from './style';
import style from '../../assets/global-style';
import { getName, getCount, isEmptyObject } from './../../api/utils';
import { HEADER_HEIGHT } from '../../api/config';
import { getAlbumList, changeEnterLoading } from './store/actionCreators';
import { connect } from 'react-redux';
import Loading from '../../baseUI/loading';
import SongsList from '../SongsList';
import MusicNote from '../../baseUI/music-note';

// 组件代码
function Album(props) {
  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState('歌单');
  const [isMarquee, setIsMarquee] = useState(false); // 是否跑步灯

  const headerEl = useRef();
  const musicNoteRef = useRef();

  const {
    currentAlbum: currentAlbumImmutable,
    enterLoading,
    songsCount,
  } = props;
  const { getAlbumDataDispatch } = props;

  const id = props.match.params.id;

  useEffect(() => {
    getAlbumDataDispatch(id);
    // eslint-disable-next-line
  }, [getAlbumDataDispatch, id]);

  let currentAlbum = currentAlbumImmutable.toJS();

  const handleBack = useCallback(() => {
    props.history.goBack();
    // eslint-disable-next-line
  }, []);

  const handleScroll = useCallback(
    (pos) => {
      let minScrollY = -HEADER_HEIGHT;
      let percent = Math.abs(pos.y / minScrollY);
      let headerDom = headerEl.current;
      // 滑过顶部的高度开始编号
      if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style['theme-color'];
        headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
        setTitle(currentAlbum.name);
        setIsMarquee(true);
      } else {
        headerDom.style.backgroundColor = '';
        headerDom.style.opacity = 1;
        setTitle('歌单');
        setIsMarquee(false);
      }
    },
    [currentAlbum]
  );

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">
              {getCount(currentAlbum.subscribedCount)}
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    );
  };

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    );
  };

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={props.history.goBack}
    >
      <Container play={songsCount}>
        <Header
          ref={headerEl}
          title={title}
          handleClick={handleBack}
          isMarquee={isMarquee}
        />
        {/* 这里是具体布局JSX代码 */}
        {!isEmptyObject(currentAlbum) ? (
          <Scroll bounceTop={false} onScroll={handleScroll}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              <SongsList
                musicAnimation={musicAnimation}
                songs={currentAlbum.tracks}
                collectCount={currentAlbum.subscribedCount}
                showCollect={true}
                showBackground={true}
              />
            </div>
          </Scroll>
        ) : null}
        {enterLoading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  currentAlbum: state.getIn(['album', 'currentAlbum']),
  enterLoading: state.getIn(['album', 'enterLoading']),
  songsCount: state.getIn(['player', 'playList']).size,
});
// 映射dispatch到组件的props上
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getAlbumList(id));
    },
  };
};

// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));
