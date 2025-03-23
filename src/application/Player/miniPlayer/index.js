import React, { useRef } from 'react';
import { getName } from '../../../api/utils';
import { MiniPlayerContainer } from './style';
import { CSSTransition } from 'react-transition-group';
import ProgressCircle from '../../../baseUI/progress-circle';

function MiniPlayer(props) {
  const { song, full, playing, percent } = props;
  const { clickPlaying, toggleFullScreenDispatch, togglePlayList } = props;

  const miniPlayerRef = useRef();

  const handleTogglePlayList = (e) => {
    togglePlayList(true);
    e.stopPropagation();
  };

  const handleToggleFullScreen = () => {
    if (toggleFullScreenDispatch) {
      toggleFullScreenDispatch(true);
    }
  };

  return (
    <CSSTransition
      in={!full}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        miniPlayerRef.current.style.display = 'flex';
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = 'none';
      }}
    >
      <MiniPlayerContainer ref={miniPlayerRef} onClick={handleToggleFullScreen}>
        <div className="icon">
          <div className="imgWrapper">
            {/* 暂停的时候唱片也停止旋转 */}
            <img
              src={song.al.picUrl}
              alt="img"
              className={`play ${playing ? '' : 'pause'}`}
              width="40"
              height="40"
            />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
            {playing ? (
              <i
                className="icon-mini iconfont icon-pause"
                onClick={(e) => clickPlaying(e, false)}
              >
                &#xe650;
              </i>
            ) : (
              <i
                className="icon-mini iconfont icon-play"
                onClick={(e) => clickPlaying(e, true)}
              >
                &#xe61e;
              </i>
            )}
          </ProgressCircle>
        </div>
        <div className="control" onClick={handleTogglePlayList}>
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  );
}

MiniPlayer.defaultProps = {
  song: {},
  full: false,
  playing: false,
  percent: 0,
  clickPlaying: null,
  toggleFullScreenDispatch: null,
  togglePlayList: null,
};

export default React.memo(MiniPlayer);
