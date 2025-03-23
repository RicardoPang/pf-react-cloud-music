import styled from 'styled-components';

export const Content = styled.div`
  position: fixed;
  top: 90px;
  bottom: ${(props) => (props.play > 0 ? '60px' : 0)};
  width: 100%;
`;

export const BannerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  border-radius: 0 0 30px 30px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 60px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
    z-index: 1;
  }
`;

export const RecommendList = styled.div`
  padding: 0 15px;

  > h1 {
    margin: 15px 0;
    font-size: 18px;
    font-weight: 600;
    color: ${(props) => props.theme.font};
  }
`;

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
`;

export const ListItem = styled.div`
  position: relative;
  height: 0;
  padding-bottom: 100%;
  border-radius: 12px;
  overflow: hidden;
  background: ${(props) => props.theme.highlight};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

  .img_wrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .dec {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    padding: 35px 10px 8px;
    font-size: 12px;
    color: #fff;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
    backdrop-filter: blur(2px);
    white-space: normal;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  .play_count {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 3px 6px;
    font-size: 12px;
    color: #fff;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 1;

    .play {
      vertical-align: middle;
      margin-right: 3px;
      font-size: 10px;
    }
  }
`;

export const EnterLoading = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  width: 100px;
  height: 100px;
  margin: auto;
  z-index: 1000;
`;
