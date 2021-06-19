import React from "react";

export default function Modal({ isShow, children, togleModal }) {
  return (
    <div
      class={`fixed z-10 inset-0 overflow-y-auto ${
        isShow ? "visible" : "invisible"
      }`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          onClick={togleModal}
          class={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${
            isShow
              ? "ease-out duration-300 opacity-100"
              : "ease-in duration-200 opacity-0"
          }`}
          aria-hidden="true"
        ></div>

        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div
          class={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full  ${
            isShow
              ? "ease-out duration-300 opacity-100 translate-y-0 sm:scale-100 "
              : "ease-in duration-200 opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          }`}
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
