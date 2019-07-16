import React from 'react'
import { connect } from 'dva'
import classnames from 'classnames'
import { withRouter, Switch, Route } from 'dva/router'
import { Sidebar } from 'components'
import { Home, Upload, Vote } from 'routes'
import { LocaleProvider, Layout, Icon } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import styles from './App.css'

const { Header, Content, Footer } = Layout

const App = ({ children, dispatch, app, location }) => {

  const { siderFolded, loggedIn, isDesktop } = app;

  const componentDidUpdate = (prevProps) => {
    /*if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
      if (!this.isDesktop()) {
        this.toggle();
      }
    }*/
  }

  const toggle = () => {
    dispatch({ type: 'app/toggleSider' });
  }

  const appClass = classnames({
    [styles.app]: true,
    [styles.withsidebar]: !siderFolded
  })

    return (
      <LocaleProvider locale={zhCN}>
      <div className={appClass}>
        <Sidebar collapsed={siderFolded} location={location} desktop={isDesktop} loggedIn={loggedIn} />
        <div className={styles.container}>
        <div className={styles.containerinner}>
          <Header className={styles.header} >
            <Icon
                className={styles.trigger}
                type={siderFolded ? 'menu-unfold' : 'menu-fold'}
                onClick={toggle}
              />
            <span className={styles.title}>Home</span>
          </Header>
          <Content className={styles.content}>
            <div className={styles.contentinner}>
              <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/upload" exact component={Upload} />
                <Route path="/vote/:time" exact component={Vote} />
              </Switch>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
          Copyright ©2007-2018 FZYZ SCAN.All rights reserved.<br/>
          Author & Current Maintainer: Googleplex<br/>
          Past Maintainer: Robot Miskcoo Upsuper
          </Footer>
        </div>
        </div>
      </div>
      </LocaleProvider>
    );
};

export default withRouter(connect(({ app }) => ({ app }))(App))
