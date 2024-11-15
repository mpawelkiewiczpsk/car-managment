import { Outlet, Link } from "react-router-dom";
import React from "react";
import { Layout, Menu, theme } from "antd";

const { Header, Content, Footer } = Layout;

const items = [
  {
    key: "users",
    label: <Link to="/users">Users</Link>,
  },
  {
    key: "car-list",
    label: <Link to="/car-list">Car list</Link>,
  },
  {
    key: "car-rent",
    label: <Link to="/car-rent">Car Rent</Link>,
  },
];

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: "0 48px" }}>
        <div style={{ margin: "16px 0" }} />
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
            height: "90vh",
          }}
        >
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default App;
