import React, { useState, useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/http-hook";

export default function DisplayEvent(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const { event } = props;
  const eventPath = `/events/${event.id}`;
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const handleClickOutside = (e) => {
    if (toggleDropdown && !e.target.closest(".dropdown-icon")) {
      setToggleDropdown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [toggleDropdown]);

  const handleDeleteEvent = async (e) => {
    e.preventDefault();
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/events/${event.id}`,
        "DELETE"
      );
    } catch (e) {}
  };

  return (
    <div>
      <Link to={eventPath}>
        <div className="flex flex-row border-4 border-navy-blue bg-light-green p-3 mb-3">
          <div className="text-navy-blue">{event.name}</div>
          <div className="ml-auto pe-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setToggleDropdown(!toggleDropdown);
              }}
              class="dropdown-icon icon-edit"
            >
              <BsThreeDotsVertical />
            </button>
            {toggleDropdown && (
              <div>
                <div className="absolute px-3 bg-white border rounded shadow-md">
                  <button onClick={handleDeleteEvent}>delete</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
