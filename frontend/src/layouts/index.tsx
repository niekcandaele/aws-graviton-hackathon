import {
  DesktopOutlined,
  FileOutlined,
  HomeOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { ReactChild, ReactFragment, ReactPortal, useState } from 'react';
import { Link } from 'umi';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default function IndexLayout(props: {
  children:
    | boolean
    | ReactChild
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = (collapsed: boolean) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<PieChartOutlined />}>
            <Link to="/stats">Global stats</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<DesktopOutlined />}>
            <Link to="/about">About</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Content style={{ margin: '5%' }}>{props.children}</Content>
        <Footer style={{ textAlign: 'center' }}>
          Created with ❤️ By <a href="https://candaele.dev/" target="_blank">Niek Candaele</a> and <a href="https://github.com/emielvanseveren" target="_blank">Emiel van Severen</a>
        </Footer>
      </Layout>
    </Layout>
  );
}
