import "./App.css";
import { useState, useEffect } from "react";
import ContactForm from "./components/contactForm";
import { BASE_URL } from "./config";
import {
  SearchIcon,
  OutlinePersonIcon,
  MailIcon,
  MobileIcon,
  LocationIcon,
  PageLoader,
  PlusIcon,
} from "./icons";
function App() {
  // const addContact = () => {};
  // const deleteContact = () => {};
  // const editContact = () => {};
  const [isShow, setModalShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [contactDetails, setContactDetails] = useState([]);
  const [_contact, setContact] = useState({});

  const getContacts = async (query) => {
    const _query = query || "";
    try {
      setLoading(true);
      const res = await fetch(BASE_URL + "contact?query=" + _query);
      const jsonRes = await res.json();
      console.log("🚀 ~ file: App.js ~ line 29 ~ getContacts ~ res", jsonRes);
      if (res?.status !== 200) {
        throw new Error(jsonRes.error);
      }
      setContactDetails(jsonRes?.data || []);
    } catch ({ message }) {
      console.error("[getContacts Error]", message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getContacts();
    return () => {
      setContactDetails([]);
    };
  }, []);

  // const onSe

  return (
    <>
      <ContactForm
        isShow={isShow}
        setModalShow={setModalShow}
        contact={_contact}
        setContact={setContact}
        getContacts={getContacts}
      />
      <div className="bg-gray-200 px-20  pb-20 h-screen pt-10">
        <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div class="py-5 flex justify-between items-center ">
            <h1 className="text-3xl text-gray-500  ">CMS </h1>
            <div class="relative">
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  getContacts(e.target.value);
                }}
                type="text"
                class="h-10 w-96 pr-8 pl-5 rounded z-0 focus:shadow focus:outline-none"
                placeholder="Search name email or contact no"
              />
              <div class="absolute top-3 right-3">
                <SearchIcon class="h-5 w-5 text-gray-400 z-20 hover:text-gray-500 cursor-pointer" />
              </div>
            </div>
            <button
              onClick={() => setModalShow(true)}
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
            >
              <PlusIcon class="h-5 w-5 mr-2" />
              Add
            </button>
          </div>

          <div class="max-w-none mx-auto">
            <div class="bg-white overflow-hidden shadow sm:rounded-lg">
              <ul
                class=" divide-y divide-gray-200 overflow-y-scroll"
                aria-disabled="true"
                style={{ height: "75vh" }}
              >
                {isLoading ? (
                  <div class="py-36">
                    <PageLoader className="h-20" />
                  </div>
                ) : contactDetails?.length === 0 ? (
                  <div class="py-36 text-center text-gray-400">
                    No contact to display !
                  </div>
                ) : (
                  contactDetails?.map((contact) => (
                    <li
                      key={contact._id}
                      onClick={() => {
                        setContact(contact);
                        setModalShow(true);
                      }}
                    >
                      <a href="#" class="block hover:bg-gray-50">
                        <div class="px-4 py-4 sm:px-6">
                          <div class="flex items-center justify-between">
                            <div class="text-sm font-medium text-indigo-600 truncate flex">
                              <OutlinePersonIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />{" "}
                              {contact?.name}
                            </div>
                            <div class="ml-2 flex-shrink-0 flex">
                              {/* <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                         
                            </span> */}
                              <div class=" flex items-center text-sm text-gray-500">
                                {contact?.contact_no}
                                <MobileIcon class="flex-shrink-0 ml-1 h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                          <div class="mt-2 flex justify-between">
                            <div class="sm:flex">
                              <div class="mr-6 flex items-center text-sm text-gray-500">
                                <MailIcon class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                {contact?.email}
                              </div>
                            </div>
                            <div class="flex items-center text-sm text-gray-500">
                              {contact?.address}
                              <LocationIcon class="flex-shrink-0 ml-1 h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))
                )}
              </ul>

              <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p class="text-sm text-gray-700">
                      Showing
                      <span class="font-medium px-1">
                        {contactDetails?.length}
                      </span>
                      results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
