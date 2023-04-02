import React, { useState } from "react";
import { Form, Divider, Input, Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { TimeSelector } from "components";
import { useMyUploads } from "services/upload";

const FormItem = Form.Item;

const ManualUpload = () => {
  const myUploads = useMyUploads();

  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const getFormData = () => form.getFieldsValue();

  const beforeUpload = async (file) =>
    form
      .validateFields()
      .then((values) => {
        setFileList([]);
        const tooBig = file.size / 1024 / 1024 > 20;
        const tooSmall = file.size / 1024 / 1024 < 1;

        if (tooBig) {
          message.error("上传文件大小不得超过20MB");
          return Promise.reject();
        }
        if (tooSmall) {
          message.error("为保证音乐质量,请上传一个至少1MB的文件");
          return Promise.reject();
        }
        return Promise.resolve();
      })
      .catch((errors) => {
        if (errors) {
          message.error("请修正所有错误后再上传文件");
        }
        return Promise.reject();
      });

  const onChange = (info) => {
    let { file } = info;
    const { response } = file;

    if (file.status === "done") {
      if (response.error === 0) {
        message.success("上传成功");
        form.resetFields();
        setFileList([]);
        myUploads.mutate();
      } else {
        message.error(response.msg);
        file.status = "error";
      }
    } else if (file.status === "error") {
      message.error("文件上传失败");
    }
    setFileList([file]);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 20 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };

  return (
    <Form form={form}>
      <FormItem
        {...formItemLayout}
        label="时段"
        name="time"
        rules={[{ required: true, message: "请选择时段" }]}
        hasFeedback
      >
        <TimeSelector style={{ width: "120px" }} />
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="曲名"
        name="name"
        rules={[{ required: true, message: "请填写曲名" }]}
        hasFeedback
      >
        <Input placeholder="歌曲名称" maxLength={100} />
      </FormItem>
      <FormItem
        {...formItemLayout}
        label="来源"
        name="origin"
        initialValue=""
        hasFeedback
      >
        <Input
          placeholder="该曲目来自的专辑,音乐家或节目,游戏等,不是表示上传者,可留空"
          maxLength={200}
        />
      </FormItem>
      <Divider>请先填写以上信息再上传文件</Divider>
      <FormItem {...formItemLayout} label="上传文件">
        <Upload.Dragger
          fileList={fileList}
          action="/api/upload"
          data={getFormData}
          accept="audio/mpeg"
          beforeUpload={beforeUpload}
          onChange={onChange}
          with-credentials={true}
          showUploadList={{ showRemoveIcon: false, showDownloadIcon: false }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">将文件拖到此处，或点击上传</p>
          <p className="ant-upload-hint">
            只能上传mp3格式的文件，且文件大小须介于1-20MB之间
          </p>
        </Upload.Dragger>
      </FormItem>
    </Form>
  );
};

export default ManualUpload;
