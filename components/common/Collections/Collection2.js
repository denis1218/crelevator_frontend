import React, { useContext } from "react";
import Slider from "react-slick";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import ProductItem from "../product-box/ProductBox12";
import { Row, Col, Container } from "reactstrap";
import CartContext from "../../../helpers/cart";
import { WishlistContext } from "../../../helpers/wishlist/WishlistContext";
import { CompareContext } from "../../../helpers/Compare/CompareContext";
import PostLoader from "../PostLoader";
import { GetAllProduct, addCart } from "../../../action/products";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchCartList } from "../../../store/slices/cartSlice";

const GET_PRODUCTS = gql`
  query products($type: _CategoryType!, $indexFrom: Int!, $limit: Int!) {
    products(type: $type, indexFrom: $indexFrom, limit: $limit) {
      items {
        id
        title
        description
        type
        brand
        category
        price
        stock
        new
        sale
        discount
        variants {
          id
          sku
          size
          color
          image_id
        }
        images {
          image_id
          id
          alt
          src
        }
      }
    }
  }
`;
const TopCollection = ({
  type,
  title,
  subtitle,
  designClass,
  noSlider,
  spanClass,
  productSlider,
}) => {
  const context = useContext(CartContext);
  const contextWishlist = useContext(WishlistContext);
  const contextCompare = useContext(CompareContext);
  const quantity = context.quantity;
  const [data, setData] = React.useState();
  const dispatch = useDispatch() ;

  React.useEffect(() => {
    GetAllProduct(data).then(res => {
      if(res) {
          if(res.success) {
            setData(res.products)
          } else {
            notify(res.msg, false);
          }
      }
    })
  }, [])

  const notify = (text, success) => {
    const options = {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    };
    if (success) {
      toast.success(text, options);
    } else {
      toast.warn(text, options);
    }
  };

  const handleAddCart = async (id) => {
    let res = await addCart(id)
    if (res.success) {
      dispatch(fetchCartList());
      notify("Add Product to Cart Successfully", true);
    } else {
      notify("This Product already added to Cart", false);
    }
  }

  return (
    <>
      <section className={designClass}>
        {noSlider ? (
          <Container>
            <Row>
              <Col>
                <div className="title3">
                  {subtitle ? <h4>{subtitle}</h4> : ""}
                  <h2 className="title-inner3">{title}</h2>
                  <div className="line"></div>
                </div>
                {
                // !data ||
                // !data.products ||
                // !data.products.items ||
                // data.products.items.length === 0 ||
                // loading ? (
                //   <div className="row mx-0 margin-default">
                //     <div className="col-xl-3 col-lg-4 col-6">
                //       <PostLoader />
                //     </div>
                //     <div className="col-xl-3 col-lg-4 col-6">
                //       <PostLoader />
                //     </div>
                //     <div className="col-xl-3 col-lg-4 col-6">
                //       <PostLoader />
                //     </div>
                //     <div className="col-xl-3 col-lg-4 col-6">
                //       <PostLoader />
                //     </div>
                //   </div>
                // ) : 
                (
                  <Slider
                    {...productSlider}
                    className="product-5 product-m no-arrow"
                  >
                    {data &&
                      data.slice(0, 8).map((product, index) => (
                        <div key={index}>
                          <ProductItem
                            product={product}
                            spanClass={spanClass}
                            addToCompare={() =>
                              contextCompare.addToCompare(product)
                            }
                            addWishlist={() =>
                              contextWishlist.addToWish(product)
                            }
                            addCart={() => handleAddCart(product.id)}
                          />
                        </div>
                      ))}
                  </Slider>
                )}
              </Col>
            </Row>
          </Container>
        ) : (
          <>
            <div className="title1 title-gradient  section-t-space">
              {subtitle ? <h4>{subtitle}</h4> : ""}
              <h2 className="title-inner1">{title}</h2>
              <hr role="tournament6" />
            </div>
            <Container>
              <Row>
                <Col>
                  <Slider {...productSlider} className="product-m no-arrow">
                    {!data ||
                    !data.products ||
                    !data.products.items ||
                    data.products.items.length === 0 ||
                    loading ? (
                      <>
                        <PostLoader />
                        <PostLoader />
                        <PostLoader />
                      </>
                    ) : (
                      data &&
                      data.products.items
                        .slice(0, 8)
                        .map((product, index) => (
                          <ProductItem
                            product={product}
                            spanClass={spanClass}
                            addToCompare={() =>
                              contextCompare.addToCompare(product)
                            }
                            addWishlist={() =>
                              contextWishlist.addToWish(product)
                            }
                            key={index}
                            addCart={() => context.addToCart(product, quantity)}
                          />
                        ))
                    )}
                  </Slider>
                </Col>
              </Row>
            </Container>
          </>
        )}
      </section>
    </>
  );
};

export default TopCollection;
