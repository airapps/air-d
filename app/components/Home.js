import React, { Component } from 'react';
import { Link } from 'react-router';
//import styles from './Home.css';

import { Button,Icon, Row, Col,Modal,Card ,Input } from 'antd';
const {dialog} = require('electron').remote;


export default class Home extends Component {

  constructor() {
    super();
    this.state = {
      loading: false,
      visible: false,
      filePath:''
    };
    this.handleOk = this.handleOk.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.fileLocation = this.fileLocation.bind(this);
  }

  showModal() {
    this.setState({
      visible: true,
    });
  }

  handleOk() {
    this.setState({loading: true});
    setTimeout(() => {
      this.setState({loading: false, visible: false});
    }, 3000);
  }

  handleCancel() {
    this.setState({visible: false});
  }

  fileLocation(){
    let filePath = dialog.showOpenDialog({properties: ['openDirectory']});
    this.setState({filePath:filePath});
  }

  render() {

    const button = <Button type="primary" icon="ellipsis" onClick={this.fileLocation}></Button>;

    return (
        <div>
          <div style={{alignItems:'center',padding:20}}>
            <Button type="primary" shape="circle"><Icon type="user"/></Button>
            <text style={{marginLeft:20,fontSize:20}}>buhe</text>
          </div>
          <div>
            <Button style={{margin:10}} onClick={this.showModal}><Icon type="plus-circle-o"/>New Project</Button>
            <Button style={{margin:10}}><Icon type="folder-open"/>Open Project</Button>
          </div>
          <div>
            <Card style={{margin:10}}>App1 <Button type="primary" style={{marginLeft:1000}}>Run</Button></Card>
            <Card style={{margin:10}}>App2 <Button type="primary" style={{marginLeft:1000}}>Run</Button></Card>
            <Card style={{margin:10}}>App3 <Button type="primary" style={{marginLeft:1000}}>Run</Button></Card>
            <Card style={{margin:10}}>App4 <Button type="primary" style={{marginLeft:1000}}>Run</Button></Card>
            <Card style={{margin:10}}>App5 <Button type="primary" style={{marginLeft:1000}}>Run</Button></Card>
            <Card style={{margin:10}}>App6 <Button type="primary" style={{marginLeft:1000}}>Run</Button></Card>
            <Card style={{margin:10}}>App7 <Button type="primary" style={{marginLeft:1000}}>Run</Button></Card>
            <Card style={{margin:10}}>App8 <Button type="primary" style={{marginLeft:1000}}>Run</Button></Card>
          </div>
          <Modal ref="modal"
                 visible={this.state.visible}
                 title="New Project" onOk={this.handleOk} onCancel={this.handleCancel}
                 footer={[
                            <Button key="back" type="ghost" size="large" onClick={this.handleCancel}>Cancel</Button>,
                            <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk}>
                              New Project
                            </Button>,
                        ]}
              >
            <div>
              <Input style={{margin:10}} placeholder="Project Name" />
              <Input style={{margin:10}} placeholder="Project Location" addonAfter={button} value={this.state.filePath}/>
            </div>

          </Modal>
        </div>
    );
  }
}
