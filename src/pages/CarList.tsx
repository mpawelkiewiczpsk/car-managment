import React, { useState, useEffect } from "react";
import { Table, Typography, Button, Modal, Form, Input, Space } from "antd";
import axiosInstance from "../api/axiosInstance.ts";

const { Title } = Typography;

interface CarType {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  pricePerDay: number;
}

const CarsList: React.FC = () => {
  const [cars, setCars] = useState<CarType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCar, setEditingCar] = useState<CarType | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const { data } = await axiosInstance.get("/cars");
      setCars(data);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: CarType) => {
    setIsEditMode(true);
    setEditingCar(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/cars/${id}`);
      setCars((prev) => prev.filter((car) => car.id !== id));
    } catch (error) {
      console.error("Error deleting car:", error);
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditMode && editingCar) {
        // Edit car
        const updatedCar = { ...editingCar, ...values };
        await axiosInstance.put(`/cars/${editingCar.id}`, updatedCar);
        setCars((prev) =>
          prev.map((car) => (car.id === editingCar.id ? updatedCar : car)),
        );
      } else {
        // Add car
        const newCar = await axiosInstance.post("/cars", values);
        setCars((prev) => [...prev, newCar.data]);
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Error saving car:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
    },
    {
      title: "Price Per Day (PLN)",
      dataIndex: "pricePerDay",
      key: "pricePerDay",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record: CarType) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <a onClick={() => handleDelete(record.id)}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title>Car List</Title>
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Car
      </Button>
      <Table<CarType> columns={columns} dataSource={cars} rowKey="id" />
      <Modal
        title={isEditMode ? "Edit Car" : "Add Car"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: true, message: "Please enter the brand" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: "Please enter the model" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="year"
            label="Year"
            rules={[
              { required: true, message: "Please enter the production year" },
              {
                type: "number",
                transform: (value) => Number(value),
                message: "Year must be a number",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Please enter the color" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="pricePerDay"
            label="Price Per Day (PLN)"
            rules={[
              { required: true, message: "Please enter the price per day" },
              {
                type: "number",
                transform: (value) => Number(value),
                message: "Price must be a number",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CarsList;
