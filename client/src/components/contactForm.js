import React, { useState, useEffect } from "react";
import Modal from "./utils/modal";
import { TrashIcon, EditIcon, ButtonLoader, CautionIcon } from "../icons";
import * as yup from "yup";
import { Formik } from "formik";
import { BASE_URL } from "../config";
import toast, { Toaster } from "react-hot-toast";

export default function ContactForm({
  isShow,
  setModalShow,
  contact,
  setContact,
  getContacts,
}) {
  //

  useEffect(() => {
    return () => {
      // setContact(null);
      // setEdit(false);
      // setDelete(false);
    };
  }, [contact]);

  const [loading, setLoading] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [isDelete, setDelete] = useState(false);

  const isUpdate = contact?._id ? true : false;

  const togleModal = () => {
    setContact(null);
    setEdit(false);
    setDelete(false);
    setModalShow(false);
  };
  const onSubmit = async (values, actions) => {
    try {
      const { name, email, contact_no, address } = values;

      const _method = isUpdate ? "PUT" : "POST";
      const _path = isUpdate ? "edit-contact" : "add-contact";
      setLoading(true);
      let _body = {
        name,
        email,
        contact_no,
        address,
      };
      let _toast_message = "successfully created";
      if (isUpdate) {
        _toast_message = "successfully updated";
        _body._id = contact?._id;
      }
      console.log(
        "🚀 ~ file: contactForm.js ~ line 28 ~ onSubmit ~ _body",
        _body
      );
      const res = await fetch(BASE_URL + _path, {
        method: _method,
        body: JSON.stringify(_body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonRes = await res.json();
      if (res?.status !== 200) {
        throw new Error(jsonRes.error);
      }
      actions.resetForm();
      toast.success(_toast_message);
      togleModal();
      getContacts();
    } catch ({ message }) {
      // actions.resetForm();
      toast.error(`Error ${message}`);
      console.error("[onSubmit Error]", message);
    }
    setLoading(false);
  };
  const onDelete = async () => {
    try {
      setLoading(true);

      const res = await fetch(BASE_URL + "delete-contact", {
        method: "DELETE",
        body: JSON.stringify({ _id: contact?._id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const jsonRes = await res.json();
      if (res?.status !== 200) {
        throw new Error(jsonRes.error);
      }
      toast.success("Successfully deleted!");
      togleModal();
      getContacts();
    } catch ({ message }) {
      toast.error(`Error ${message}`);
      console.error("[onDelete Error]", message);
    }
    setLoading(false);
  };
  const _disabled = !isEdit && contact?._id;

  return (
    <Modal isShow={isShow} setModalShow={setModalShow} togleModal={togleModal}>
      <div class="w-full ">
        {isDelete ? (
          <div>
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="sm:flex sm:items-start">
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <CautionIcon class="h-6 w-6 text-red-600" />
                </div>
                <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    class="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Delete Contact
                  </h3>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete {contact?.name} ? All of
                      contact data will be permanently removed. This action
                      cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={onDelete}
                type="button"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {loading ? <ButtonLoader className="h-5 w-5" /> : "Delete"}
              </button>
              <button
                onClick={togleModal}
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <Formik
            enableReinitialize
            initialValues={{
              name: contact?.name || "",
              email: contact?.email || "",
              contact_no: contact?.contact_no || "",
              address: contact?.address || "",
            }}
            onSubmit={(values, actions) => onSubmit(values, actions)}
            validationSchema={yup.object().shape({
              name: yup.string().required(),
              contact_no: yup
                .string()
                .required("contact number is a required field"),
              email: yup.string().email().required(),
              address: yup.string().required(),
            })}
          >
            {({
              values,
              handleChange,
              errors,
              setFieldTouched,
              touched,
              isValid,
              handleSubmit,
              resetForm,
            }) => (
              <>
                <div class="flex justify-between items-center">
                  <h1 class=" text-2xl font-bold">Create a new contact</h1>
                  <div class="flex  items-center">
                    {isUpdate && (
                      <>
                        <TrashIcon
                          onClick={() => setDelete(true)}
                          className="h-6 w-6 text-pink-700 cursor-pointer hover:text-pink-900  mx-2 "
                        />
                        <EditIcon
                          onClick={() => setEdit(!isEdit)}
                          className={`h-6 w-6 ${
                            _disabled ? "text-gray-500" : "text-green-500"
                          }  cursor-pointer hover:text-gray-700 ml-2`}
                        />
                      </>
                    )}
                  </div>
                </div>
                <div class="mb-4 mt-4">
                  <label
                    class="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    disabled={_disabled}
                    class="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10 border focus:bg-white focus:border-gray-800"
                    type="text"
                    placeholder="Enter name"
                    value={values.name}
                    onChange={handleChange("name")}
                    onBlur={() => setFieldTouched("name")}
                    name="name"
                  />
                  <HelperText>{touched?.name && errors?.name}</HelperText>
                </div>

                <div class="mb-4 mt-4">
                  <label
                    class="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    disabled={_disabled}
                    class="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10 border focus:bg-white focus:border-gray-800"
                    type="text"
                    placeholder="Enter email "
                    value={values.email}
                    onChange={handleChange("email")}
                    onBlur={() => setFieldTouched("email")}
                  />
                  <HelperText>{touched?.email && errors?.email}</HelperText>
                </div>

                <div class="mb-4 mt-4">
                  <label
                    class="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="name"
                  >
                    Contact No
                  </label>
                  <input
                    disabled={_disabled}
                    class="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10 border focus:bg-white focus:border-gray-800"
                    type="text"
                    placeholder="Enter contect no"
                    value={values.contact_no}
                    onChange={handleChange("contact_no")}
                    onBlur={() => setFieldTouched("contact_no")}
                  />
                  <HelperText>
                    {touched?.contact_no && errors?.contact_no}
                  </HelperText>
                </div>
                <div class="mb-4 mt-4">
                  <label
                    class="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="address"
                  >
                    Address
                  </label>

                  <textarea
                    disabled={_disabled}
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    class="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-32 border focus:bg-white focus:border-gray-800"
                    value={values.address}
                    onChange={handleChange("address")}
                    onBlur={() => setFieldTouched("address")}
                  ></textarea>
                  <HelperText>{touched?.address && errors?.address}</HelperText>
                </div>

                <div class="flex w-full mt-6">
                  <button
                    disabled={loading}
                    onClick={handleSubmit}
                    class="w-full bg-gray-800 hover:bg-gray-900 text-white text-sm py-2 px-4 font-semibold rounded focus:outline-none focus:shadow-outline h-10"
                    type="button"
                  >
                    {loading ? (
                      <ButtonLoader className="h-5 w-5" />
                    ) : isUpdate ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
                <div class="flex w-full mt-4">
                  <button
                    onClick={togleModal}
                    class="w-full  hover:bg-gray-200 text-gray-500 text-sm py-2 px-4 font-semibold rounded focus:outline-none focus:shadow-outline h-10"
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </Formik>
        )}
      </div>
    </Modal>
  );
}
const HelperText = ({ children }) => (
  <p className="text-red-400 py-1 ">{children} </p>
);
