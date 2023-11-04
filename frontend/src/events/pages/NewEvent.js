import React from "react";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function NewEventForm(props) {
  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
      name: "",
    },
    validationSchema: Yup.object({
      startDate: Yup.string().required("Required"),
      endDate: Yup.string().required("Required"),
      name: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
      submitHandler(values);
      alert(JSON.stringify(values, null, 2));
    },
  });

  const submitHandler = async (values) => {
    console.log(values);
    // try {
    //     const responseData = await sendRequest(
    //         "http://localhost:7005/api/events/new",
    //         "POST",
    //         JSON.stringify({
    //           email: formState.inputs.email.value,
    //           password: formState.inputs.password.value,
    //         }),
    //         {
    //           "Content-Type": "application/json",
    //         }
    //       );
    // } catch (err) {

    // }
  };

  const location = useLocation();
  console.log(location.state);
  return <div>hello</div>;
}
