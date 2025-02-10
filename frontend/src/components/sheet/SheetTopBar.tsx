import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Input, Modal, message, Form, DatePicker, Upload } from 'antd';
import { PlusOutlined, FileExcelOutlined, InboxOutlined } from '@ant-design/icons';
import { setDataArray, DataEntry } from '../../stores/commonStore'; // Import the action to set data array
import { RootState } from '../../stores/commonStore'; // Import the RootState type
import dayjs from 'dayjs'; // Import dayjs for date formatting

const { Dragger } = Upload;

const SheetTopBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { Search } = Input;
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
    const [form] = Form.useForm(); // Create a form instance
    const dataArray = useSelector((state: RootState) => state.dataArray); // Get the current data array from the store

    const onSearch = (e: any) => {
        // Handle search logic here
    };


    const handleAddNew = () => {
        setIsModalVisible(true); // Show the modal
    };

    const handleOk = async () => {
        try {
            const marketPrices = await form.validateFields(); // Validate form fields

            // Create a new data entry
            const newDataEntry: DataEntry = {
                dateTime: marketPrices.dateTime.format('YYYY-MM-DD HH:mm:ss'), // Format the date/time
                marketPrice: parseFloat(marketPrices.marketPrice), // The decimal marketPrice input from the user, converted to a number
            };

            // Dispatch action to save the new data entry in the store
            dispatch(setDataArray([...dataArray, newDataEntry])); // Spread the current data array and add the new entry

            // Show success message
            message.success('Added successfully!');

            // Reset fields and close modal
            form.resetFields();
            setIsModalVisible(false);
        } catch (error) {
            // Handle validation error
            message.error('Please fill in all fields correctly.');
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false); // Close the modal
    };

    const handleUploadModal = () => {
        setIsUploadModalVisible(true); // Show the upload modal
    };

    const handleUploadCancel = () => {
        setIsUploadModalVisible(false); // Close the upload modal
    };

    const uploadProps = {
        name: 'file',
        multiple: false,
        accept: '.xlsx, .xls, .csv', // Allow CSV files as well
        customRequest: async ({ file, onSuccess, onError }: any) => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('https://localhost:7298/Practice/upload-excel', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const newData = await response.json(); // Get the new data from the response
                    dispatch(setDataArray(newData)); // Replace the existing data with the new data
                    message.success(`${file.name} file uploaded successfully.`);
                    onSuccess(file);
                    setIsUploadModalVisible(false); // Close the upload modal on success
                } else {
                    message.error(`${file.name} file upload failed.`);
                    onError(new Error('Upload failed.'));
                }
            } catch (error) {
                message.error(`${file.name} file upload failed.`);
                onError(error);
            }
        },
        onChange(info: any) {
            const { status } = info.file;
            if (status === 'done') {
                // This will not be triggered again since we handle success in customRequest
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (
        <div className='practice-sheet__topbar'>
            <div className='sheet__topbar--left'>
                {/* Additional content can go here */}
            </div>
            <div className='sheet__topbar--right'>
                <Search className='mr-2' placeholder="Input search text" onSearch={(e) => onSearch(e)} style={{ width: 200 }} />
                <Button className='mr-2' type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>
                    Add new
                </Button>
                <Button icon={<FileExcelOutlined />} onClick={handleUploadModal}>
                    Import Excel
                </Button>
            </div>

            {/* Modal for adding new entry */}
            <Modal
                title="Add New Entry"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="dateTime"
                        label="Date and Time"
                        rules={[{ required: true, message: 'Please select date and time!' }]}
                    >
                        <DatePicker
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="Select date and time"
                        />
                    </Form.Item>
                    <Form.Item
                        name="marketPrice"
                        label="Decimal MarketPrice"
                        rules={[{ required: true, message: 'Please enter a decimal marketPrice!' }]}
                    >
                        <Input
                            placeholder="Enter decimal marketPrice"
                            type="number"
                        />
                    </Form.Item>
                </Form>
            </Modal>

            {/* Modal for uploading Excel file */}
            <Modal
                title="Upload Excel File"
                visible={isUploadModalVisible}
                onCancel={handleUploadCancel}
                footer={null}
            >
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
                    </p>
                </Dragger>
            </Modal>
        </div>
    );
}

export default SheetTopBar;