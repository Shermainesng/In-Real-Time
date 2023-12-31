import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useFormik, Field } from "formik";
import * as Yup from "yup";

import Button from "../../shared/components/FormElements/Button";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AuthContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../ui/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

export default function NewEventDate(props) {
  const history = useHistory();
  const moment = require("moment");
  const today = props.event
    ? props.event.startDate
    : moment().format().slice(0, 10);
  const futureDate = props.event
    ? props.event.endDate
    : moment(today).add(3, "days").format("YYYY-MM-DD");
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const firstName = props.event ? props.event.name : "";

  const auth = useContext(AuthContext);
  const userId = auth.userId;

  const formik = useFormik({
    initialValues: {
      startDate: today,
      endDate: futureDate,
      eventName: firstName,
    },
    validationSchema: Yup.object({
      startDate: Yup.string().required("Required"),
      endDate: Yup.string().required("Required"),
      eventName: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      const combinedData = { userId, ...values };
      handleSubmit(combinedData);
    },
  });

  const handleDateChange = (fieldName, date) => {
    formik.handleChange({
      target: {
        name: fieldName,
        value: date.toISOString().slice(0, 10),
      },
    });
  };

  const handleSubmit = async (values) => {
    try {
      let responseData;
      if (props.event) {
        //EDIT EVENT INSTEAD
        responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/events/${props.event.id}`,
          "PATCH",
          JSON.stringify({
            startDate: values.startDate,
            endDate: values.endDate,
            name: values.eventName,
          }),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        console.log("edited poll", responseData);
        props.setShowNewEventPopup(false);
        props.onUpdate(
          responseData.event.startDate,
          responseData.event.endDate,
          responseData.event.name
        );
      } else {
        responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/events/new",
          "POST",
          JSON.stringify({
            startDate: values.startDate,
            endDate: values.endDate,
            name: values.eventName,
          }),
          {
            Authorization: "Bearer " + auth.token,
            "Content-Type": "application/json",
          }
        );
        const eventId = responseData.event._id;
        history.push(`/events/${eventId}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="overlay">
      <div className="card bg-base-100 popup-container bg-white">
        {isLoading && <LoadingSpinner />}
        <div className="card-body">
          <div className="flex justify-between">
            <h2 className="card-title">When do you want to use this event?</h2>
            <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-hide="default-modal"
              onClick={() => props.setShowNewEventPopup(false)}
            >
              <svg
                class="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <DatePicker
              id="startDate"
              label="Start date"
              value={dayjs(formik.values.startDate)}
              onChange={(date) => handleDateChange("startDate", date)}
            />

            <DatePicker
              id="endDate"
              label="End date"
              value={dayjs(formik.values.endDate)}
              onChange={(date) => handleDateChange("endDate", date)}
            />

            <h2 className="card-title">Give your event a name:</h2>
            <div className="text-left">
              <input
                id="eventName"
                type="text"
                placeholder="Event name"
                className="input input-bordered input-lg w-full max-w-s bg-white"
                value={formik.values.eventName}
                onChange={formik.handleChange}
              />
            </div>
            <div className="card-actions justify-end">
              <button type="submit" yellow>
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
