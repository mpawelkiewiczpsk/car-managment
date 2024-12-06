import React, { useState, useEffect } from "react";
import { Table, Tag } from "antd";
import axiosInstance from "../api/axiosInstance.ts";

const RentalsList = () => {
  const [rentals, setRentals] = useState([]);

  const getData = () => {
    Promise.all([
      axiosInstance.get("/rentals"),
      axiosInstance.get("/users"),
      axiosInstance.get("/cars"),
    ])
      .then(([rentalsRes, usersRes, carsRes]) => {
        const rentalsData = rentalsRes.data;
        const usersData = usersRes.data;
        const carsData = carsRes.data;

        const mergedRentals = rentalsData.map((rental) => {
          const user = usersData.find((u) => u.id === rental.userId);
          const car = carsData.find((c) => c.id === rental.carId);
          return {
            ...rental,
            userName: user ? user.name : "Unknown User",
            carName: car ? `${car.brand} ${car.model}` : "Unknown Car",
          };
        });
        setRentals(mergedRentals);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    getData();
  }, []);

  const onChange = (data) => {
    axiosInstance.put(`/rentals/${data.id}`, data).then(() => {
      getData();
    });
  };

  const columns = [
    {
      title: "Rental ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Car",
      dataIndex: "carName",
      key: "carName",
    },
    {
      title: "Rental Date",
      dataIndex: "rentalDate",
      key: "rentalDate",
    },
    {
      title: "Return Date",
      dataIndex: "returnDate",
      key: "returnDate",
    },
    {
      title: "Amount to Pay (PLN)",
      dataIndex: "amountToPay",
      key: "amountToPay",
    },
    {
      title: "Returned",
      dataIndex: "isReturned",
      key: "isReturned",
      render: (isReturned, data) => {
        const newData = {
          ...data,
          carName: undefined,
          userName: undefined,
          isReturned: !isReturned,
        };

        return (
          <Tag
            color={isReturned ? "green" : "red"}
            onClick={() => onChange(newData)}
          >
            {isReturned ? "Yes" : "No"}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      <h1>Rentals List</h1>
      <Table dataSource={rentals} columns={columns} rowKey="id" />
    </div>
  );
};

export default RentalsList;
