import styled from 'styled-components';

export const NavContainer = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 95px;
  width: 100%;
  padding: 10px 15px;
  background: ${(props) => props.theme.background};
  z-index: 100;

  // 添加模糊效果
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

export const ListContainer = styled.div`
  position: fixed;
  top: 160px;
  left: 0;
  bottom: 0;
  overflow: hidden;
  width: 100%;
  padding: 0 15px;

  .pull-up-loading,
  .pull-down-loading {
    position: absolute;
    left: 0;
    right: 0;
    text-align: center;
  }

  .pull-up-loading {
    bottom: 0;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pull-down-loading {
    top: 0;
    height: 30px;
  }
`;

export const List = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  padding: 10px 0;

  .title {
    grid-column: 1 / -1;
    margin: 10px 0;
    font-size: 14px;
    font-weight: 600;
    color: ${(props) => props.theme.font};
  }
`;

export const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: ${(props) => props.theme.highlight};
  border-radius: 12px;
  transition: transform 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

  .img_wrapper {
    width: 120px;
    height: 120px;
    margin-bottom: 12px;
    border-radius: 60px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

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

  .name {
    font-size: 14px;
    font-weight: 500;
    color: ${(props) => props.theme.font};

    // 超出显示省略号
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
