import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../helper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const icon_s= {
    height:"2.5rem",
    width:"2.5rem",
    lineHeight:"1.5rem",
    fontSize:"1.3rem",
    background:"rgb(236 236 236)",
    color:"#130f40",
    borderRadius:".5rem",
    marginLeft:".3rem",
    cursor:"pointer",
    textAlign:"center",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form
        className="d-flex search-form"
        role="search"
        onSubmit={handleSubmit}
      >
       <input 
  className="form-control me-2"
  type="search"
  placeholder="Search"
  aria-label="Search"
  value={values.keyword}
  onChange={(e) => setValues({ ...values, keyword: e.target.value })}
  style={{ width: "84px" }} // Adjust the width value as needed
/>

       <button className="btn" type="submit" style={icon_s} >
        <FontAwesomeIcon icon={faMagnifyingGlass}  />
                </button>
      </form>
    </div>
  );
};

export default SearchInput;
