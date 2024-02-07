import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";
import { BASE_URL } from "../helper";
import { Container, Row, Col } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Food from "../Food.gif";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const hero_section = {
    ".contents": {
      //  "marginTop":"40px",
      backgroundColor: "antiquewhite",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },
    ".contents span": {
      "font-size": "2rem",
      color: "#27ae60",
      "text-align": "center",
    },
    ".contents h3": {
      "font-size": "4rem",
      color: "#130f40",
      "text-align": "center",
      "padding-top": "1rem",
    },
    ".contents p": {
      "font-size": "1.6rem",
      color: "#666",
      "line-height": "2",
      padding: "1rem 0",
      "text-align": "center",
    },
  };

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/v1/category/get-category`
      );
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/api/v1/product/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more
  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}/api/v1/product/product-list/${page}`
      );
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/api/v1/product/product-filters`,
        {
          checked,
          radio,
        }
      );
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout title={"ALl Products - Best offers "}>
      {/* banner image */}
      <Container className="mt-5">
        <Row>
          <Col sm={12} md={6}>
            <div className="mt-5" style={hero_section}>
              <div className="contents mt-5">
                <span
                  className="mt-5"
                  style={{
                    fontSize: "1.6rem",
                    color: "#27ae60",
                    textAlign: "center",
                  }}
                >
                  welcome foodies
                </span>
                <h3
                  style={{
                    fontSize: "2.8rem",
                    color: "#130f40",

                    textAlign: "center",
                    paddingTop: "1rem",
                  }}
                >
                  Different spices for the Different tastes 😋
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#666",
                    lineHeight: "2",
                    padding: "1rem 0",
                    textAlign: "center",
                  }}
                >
                  Contactless ordering is a dine-in experience that involves no
                  close contact with restaurant staff and minimal touching of
                  shared surfaces.
                </p>
              </div>
              {/* <a href="#ordernow" className="btn" style={{fontSize: "large"}}>
            order now
          </a> */}
            </div>
          </Col>
          <Col sm={12} md={6}>
            <img src={Food} className="img" alt="wait until the page loads" />
            {/* <img
            src="path/to/image.jpg"
            alt="Image"
            style={{ width: '100%', height: 'auto' }}
          /> */}
          </Col>
        </Row>
      </Container>
      {/* <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      /> */}
      {/* banner image */}
      <div className="container-fluid row mt-3 home-page">
        <div className="col-md-3 filters">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          {/* price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
        <div className="col-md-9 ">
          <h1 className="text-center">All Products</h1>
          <div className="d-flex flex-wrap d-flex justify-content-center">
            {products?.map((p) => (
              <div className="card m-2" key={p._id}>
                <img
                  src={`${BASE_URL}/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {((p.quantity || 1) * p.price).toLocaleString("en-US", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </h5>
                  </div>
                  <p className="card-text ">
                    {p.description.substring(0, 60)}...
                  </p>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        p.quantity = p.quantity > 1 ? p.quantity - 1 : 1;
                        setProducts([...products]);
                      }}
                    >
                      -
                    </button>
                    <span className="mx-2">{p.quantity || 1}</span>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        p.quantity = (p.quantity || 1) + 1;
                        setProducts([...products]);
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className="card-name-price">
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button
                      className="btn btn-dark ms-1"
                      onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem(
                          "cart",
                          JSON.stringify([...cart, p])
                        );
                        toast.success("Item Added to cart");
                      }}
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Loadmore <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
