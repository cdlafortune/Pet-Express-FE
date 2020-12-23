import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

const VerticalForm = ({
  fields,
  layout,
  data,
  handleSave,
  setIsModalVisible,
}) => {
  const [form] = Form.useForm();
  const [formLayout, setFormLayout] = useState(layout);
  const [formData, setFormData] = useState(data);
  const [loading, setLoading] = useState({ loading: false, image_url: '' });

  const onSubmit = e => {
    e.preventDefault();
    handleSave(formData);
  };

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFormLayoutChange = ({ layout }) => {
    setFormLayout(layout);
  };

  // Image Upload Functions
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const uploadImage = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'images');
    setLoading(true);
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/milo95/image/upload',
      { method: 'POST', body: data }
    );
    const file = await res.json();

    setFormData({ ...formData, image_url: file.secure_url });
    setLoading({ loading: false });
  };

  const uploadButton = (
    <div>
      {loading.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // End of Image Upload Functions //

  const formItemLayout =
    formLayout === layout
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : null;

  const buttonItemLayout =
    formLayout === layout
      ? {
          wrapperCol: { span: 14, offset: 4 },
        }
      : null;

  return (
    <div>
      <Form
        onSubmit={e => {
          onSubmit(formData);
        }}
        {...formItemLayout}
        layout={formLayout}
        form={form}
        initialValues={{ layout: formLayout }}
        onValuesChange={onFormLayoutChange}
      >
        {fields.map(field => (
          <Form.Item key={field.data} label={field.displayName}>
            <Input
              name={field.data}
              onChange={e => onChange(e)}
              value={formData[field.data]}
            />
          </Form.Item>
        ))}
        <Form.Item label={'Photo'}>
          <Input
            type="file"
            name="file"
            placeholder="Upload Image..."
            onChange={uploadImage}
          />
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() => {
              setIsModalVisible(false);
              handleSave(formData);
            }}
            type="submit"
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default VerticalForm;
