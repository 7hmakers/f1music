import React from "react";
import classnames from "classnames";
import { withRouter } from "dva/router";
import { Sidebar, Footer, Header } from "components/admin";
import { ConfigProvider, Layout } from "antd";
import zhCN from "antd/es/locale/zh_CN";
import "antd/dist/antd.css";
import styles from "./App.css";
import useSidebar from "../hooks/useSidebar";

const { Content } = Layout;

const Admin = ({ children, location }) => {
  const [sidebarCollapsed, toggleSidebar] = useSidebar(location);

  const appClass = classnames({
    [styles.app]: true,
    [styles.withSidebar]: !sidebarCollapsed
  });

  return (
    <ConfigProvider locale={zhCN}>
      <div className={appClass}>
        <Sidebar collapsed={sidebarCollapsed} />
        <div className={styles.overlay} onClick={toggleSidebar} />
        <div className={styles.container}>
          <div className={styles.containerInner}>
            <Header
              sidebarCollapsed={sidebarCollapsed}
              toggleSidebar={toggleSidebar}
            />
            <Content className={styles.content}>
              <div className={styles.contentInner}>{children}</div>
            </Content>
            <Footer />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default withRouter(Admin);
