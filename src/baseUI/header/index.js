import React, { forwardRef } from 'react';
import { HeaderContainer } from './style';

const Header = forwardRef((props, ref) => {
  const { handleClick, title, isMarquee } = props;

  return (
    <HeaderContainer ref={ref}>
      <div className="back" onClick={handleClick}>
        <i className="iconfont icon-back">&#xe655;</i>
      </div>
      {isMarquee ? (
        <div className="marquee">
          <h1 className="text">{title}</h1>
        </div>
      ) : (
        <h1>{title}</h1>
      )}
    </HeaderContainer>
  );
});

Header.defaultProps = {
  handleClick: () => {},
  title: '标题',
  isMarquee: false,
};

export default React.memo(Header);
