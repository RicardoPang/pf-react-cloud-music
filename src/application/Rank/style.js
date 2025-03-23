import styled from 'styled-components';

// Props中的globalRank和tracks.length均代表是否为全球榜

export const Container = styled.div`
  position: fixed;
  top: 90px;
  bottom: ${(props) => (props.play > 0 ? '60px' : 0)};
  width: 100%;
  .offical,
  .global {
    margin: 10px 5px;
    padding-top: 15px;
    font-weight: 700;
    font-size: 14px;
    color: ${(props) => props.theme.font};
  }
`;
export const List = styled.ul`
  margin-top: 10px;
  padding: 0 5px;
  display: ${(props) => (props.globalRank ? 'flex' : '')};
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  background: ${(props) => props.theme.background};
  &::after {
    content: '';
    display: ${(props) => (props.globalRank ? 'block' : 'none')};
    width: 32vw;
  }
`;
export const ListItem = styled.li`
  display: ${(props) => (props.tracks.length ? 'flex' : '')};
  padding: 3px 0;
  border-radius: 12px;
  width: ${(props) => (props.tracks.length ? '100%' : '32vw')};
  ${(props) => (props.tracks.length ? '' : 'margin-bottom: 20px')};
  background: ${(props) => props.theme.highlight};
  .img_wrapper {
    position: relative;
    width: ${(props) => (props.tracks.length ? '27vw' : '32vw')};
    height: ${(props) => (props.tracks.length ? '27vw' : '32vw')};
    border-radius: ${(props) =>
      props.tracks.length ? '12px 0 0 12px' : '12px'};

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 40%;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
      border-radius: inherit;
      pointer-events: none;
    }

    img {
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }

    .update_frequency {
      position: absolute;
      left: 7px;
      bottom: 7px;
      font-size: 12px;
      color: #fff;
      padding: 3px 6px;
      border-radius: 6px;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(2px);
      z-index: 1;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
  }
`;
export const SongList = styled.ul`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px 15px;
  > li {
    font-size: 13px;
    color: ${(props) => props.theme.font};
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
  }
`;
