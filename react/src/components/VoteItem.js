import React from 'react';
import { connect } from 'dva';
import { Input, Rate, Button, message } from 'antd';
import styles from './VoteItem.css';
import YPlayer from './YPlayer';
import { config } from 'utils';

const { voteTexts } = config;

class VoteItem extends React.Component
{
  constructor(props) {
    super(props);
    this.handleVote = this.handleVote.bind(this);
  }

  timeListener = (time) => {
    const { dispatch, vote } = this.props;
    if(time >= 30 && !vote.canVote) {
      dispatch({ type: 'vote/toggleVote' });
    }
  }

  handleVote() {
    const { vote, dispatch, song } = this.props;
    const { canSubmit } = vote;
    if(!canSubmit) {
      message.error('选择或更改评价后才能提交', 5);
      return;
    }
    this.props.handleAuto();
    dispatch({ type: 'vote/vote', payload:  song.id }).then((success) => {
      if(success) {
        message.success('投票成功!', 5);
        this.props.handleAuto(true);
      }
    });
  }
  report(id) {};

  play = () => {
    this.player.play();
  }

  stop = () => {
    this.player.stop();
  }

  render() {
    const { song, vote, dispatch, loading } = this.props;
    const { canVote, showReport, rate, isDesktop } = vote;
    const buttonProps = {
      shape: !isDesktop ? "circle" : undefined
    };
    return (
      <span>
      <div>
      <YPlayer
          src={"http://localhost:81"+song.url}
          onProgress={this.timeListener}
          onEnded={this.handleVote}
          ref={(player) => {this.player = player}}
          className={styles.yplayer}
      /><br/>
        <Button size="small" onClick={() => dispatch({ type: 'vote/toggleReport' })} className={styles.toggleReport} >举报</Button>
        </div><br/>
        {/*<transition name="el-fade-in-linear">*/}
        { canVote
          && (<div className={styles.voteArea}><hr/>
            <Rate value={rate} onChange={(value) => dispatch({ type: 'vote/updateRate', payload: value }) } className={styles.rate} />
              {rate !== 0 && <div className="ant-rate-text" className={styles.voteText}>{voteTexts[rate]}</div>}
            <Button
              type="primary"
              loading={loading.effects['vote/vote']}
              className={styles.voteButton}
              onClick={this.handleVote}
              icon="check"
              {...buttonProps}>{ isDesktop && "投票" }</Button>
          </div>)
        }
        {/*</transition>
          <transition name="el-fade-in-linear">*/}
          { showReport
            && (<div className={styles.reportArea}>
              <Input placeholder="填写举报原因" className={styles.reason} maxLength="50" />
              <Button type="primary" onClick={this.report(song.id)} className={styles.reportButton}>提交</Button>
            </div>)
          }
          {/*</transition>*/}
          </span>
    );
  }
}

export default connect(({vote, loading}) => ({vote, loading}), null, null, { withRef: true })(VoteItem);
