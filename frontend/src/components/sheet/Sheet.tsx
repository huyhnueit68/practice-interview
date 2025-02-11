import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Device1 from '../../assets/images/device1.webp';
import Device2 from '../../assets/images/device3.webp';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import SheetTopBar from './SheetTopBar';
import { AgGridReact } from 'ag-grid-react';
import { DatePicker, Form, Input, message, Modal, Popconfirm, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { RootState } from '../../stores/commonStore';
import { setDataArray, DataEntry } from '../../stores/commonStore'; // Import the action to set data array
import dayjs from 'dayjs';

const Sheet = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const dataArray = useSelector((state: RootState) => state.dataArray); // Get the current data array from the store
    const [editingEntry, setEditingEntry] = useState<DataEntry | null>(null); // State to hold the entry being edited
    const [form] = Form.useForm(); // Create a form instance
    const [isModalVisible, setIsModalVisible] = useState(false);

    /**
     * Deletes a device entry from the data array.
     * @param data - The data object containing the entry to be deleted.
     * CreatedBy: Harry (10.02.2025)
     */
    const onDeleteDevice = (data: any) => {
        const updatedDataArray = dataArray.filter(entry => entry.dateTime !== data.data.dateTime);
        dispatch(setDataArray(updatedDataArray)); // Update the store with the new data array
        message.success('Deleted successfully!'); // Show success message
    }

    /**
     * Closes the modal for editing an entry and clears the editing entry.
     * CreatedBy: Harry (10.02.2025)
     */
    const handleCancel = () => {
        setIsModalVisible(false); // Close the modal
        setEditingEntry(null); // Clear the editing entry
    };

    /**
     * Handles the submission of the edit entry form.
     * Validates the form fields and updates the data entry in the Redux store.
     * CreatedBy: Harry (10.02.2025)
     */
    const handleOk = async () => {
        try {
            const values = await form.validateFields(); // Validate form fields

            // Create a new data entry
            const updatedEntry: DataEntry = {
                dateTime: values.dateTime.format('YYYY-MM-DD HH:mm:ss'), // Format the date/time
                marketPrice: parseFloat(values.marketPrice), // The decimal value input from the user, converted to a number
            };

            // Update the data array in the store
            const updatedDataArray = dataArray.map(entry =>
                entry.dateTime === editingEntry?.dateTime ? updatedEntry : entry
            );

            dispatch(setDataArray(updatedDataArray)); // Update the store with the new data array

            // Show success message
            message.success('Updated successfully!');

            // Reset fields and close modal
            form.resetFields();
            setIsModalVisible(false);
            setEditingEntry(null); // Clear the editing entry
        } catch (error) {
            // Handle validation error
            message.error('Please fill in all fields correctly.');
        }
    };

    /**
     * Prepares the entry for editing by setting the form values and opening the modal.
     * @param record - The record object containing the entry to be edited.
     * CreatedBy: Harry (10.02.2025)
     */
    const handleEdit = (record: any) => {
        setEditingEntry(record.data); // Set the entry to be edited
        form.setFieldsValue({
            dateTime: dayjs(record.data.dateTime), // Set the dateTime field
            marketPrice: record.data.marketPrice, // Set the decimal marketPrice field
        });
        setIsModalVisible(true); // Show the modal
    };

    /**
     * Defines the column structure for the data grid.
     * CreatedBy: Harry (10.02.2025)
     */
    const columnDefs: any = useMemo(() => {
        return [
            {
                headerName: 'S/N',
                field: 'S/N',
                tooltipField: 'S/N',
                resizable: true,
                maxWidth: 100,
                minWidth: 50,
                suppressMenu: true,
                floatingFilterComponentParams: { suppressFilterButton: true },
                valueGetter: "node.rowIndex + 1",
                pinned: "left"
            },
            {
                headerName: 'Date',
                field: 'dateTime',
                tooltipField: 'Date',
                resizable: true,
                minWidth: 200,
                maxWidth: 200,
                flex: 1,
                filter: 'agSetColumnFilter',
                pinned: "left",
                valueFormatter: (params: any) => {
                    return dayjs(params.value).format('YYYY-MM-DD HH:mm:ss'); // Format the date
                }
            },
            {
                headerName: 'Market Price EX1',
                field: 'marketPrice',
                tooltipField: 'Market Price',
                resizable: true,
                minWidth: 200,
                flex: 1,
                filter: 'agSetColumnFilter',
            },
            {
                headerName: 'Action',
                field: '',
                resizable: false,
                minWidth: 120,
                width: 120,
                pinned: "right",
                sortable: false,
                suppressMenu: true,
                cellRenderer: (record: any) => {
                    let hasPer = true; // Placeholder for permission check
                    return (
                        <>
                            <EditOutlined
                                title="Sửa thiết bị"
                                style={{
                                    marginLeft: 12,
                                    color: !hasPer ? '#6b7280' : '#000',
                                    cursor: !hasPer ? 'not-allowed' : 'pointer'
                                }}
                                onClick={() => handleEdit(record)}
                            />
                            <Popconfirm
                                title="Are you sure you want to delete?"
                                onConfirm={() => onDeleteDevice(record)}
                                okText="Yes"
                                placement="leftTop"
                                cancelText="No"
                            >
                                <DeleteOutlined
                                    title='Delete Price'
                                    style={{
                                        marginLeft: 12,
                                        color: !hasPer ? '#6b7280' : 'red',
                                        cursor: !hasPer ? 'not-allowed' : 'pointer'
                                    }}
                                />
                            </Popconfirm>
                        </>
                    )
                }
            },
        ];
    }, [dataArray]);

    return (
        <div className="practice-sheet">
            <SheetTopBar />
            <div className='practice-sheet__boby ag-theme-alpine'>
                <AgGridReact
                    animateRows={true}
                    rowData={dataArray}
                    columnDefs={columnDefs}
                    suppressRowHoverHighlight={true}
                />
            </div>

            {/* Modal for editing entry */}
            <Modal
                title="Edit Entry"
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
        </div>
    );
}

export default Sheet;