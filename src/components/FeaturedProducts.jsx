import { FaStar, FaEye, FaCartPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoRemoveCircle } from "react-icons/io5";
import { addToCart, removeFromCart } from "../store/prodectSlice";
import {selectCartProductIds} from "../store/prodectSlice"

const FeaturedProducts = ({ data }) => {
  // const { cartProductIds } = useSelector((state) => state.products);
  const cartProductIds = useSelector(selectCartProductIds);
  const dispatch = useDispatch();

  // Log data structure
  console.log("Data received:", data);

  // Handle dynamic data structures
  const productList = Array.isArray(data) ? data : data?.results || [];

  // Generate product cards
  const productCards =
    productList.length > 0 ? (
      productList.map((item) => (
        <div className="col-md-6 col-lg-4 mb-5" key={item.id}>
          <div className="card border-0 shadow-sm h-100">
            <Link to={`/shop/${item.id}`}>
              <img
                src={item.image}
                className="card-img-top rounded"
                alt={item.name}
                style={{ height: "280px", objectFit: "cover" }}
              />
            </Link>
            <div className="card-body d-flex flex-column">
              <h5 className="card-title text-truncate">
                <Link
                  to={`/shop/${item.id}`}
                  className="text-dark text-decoration-none"
                >
                  {item.name}
                </Link>
              </h5>
              <p className="card-text text-muted small mb-2">
                {item.description.substring(0, 80)}...
              </p>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold">${item.price}</span>
              </div>
              <div className="d-flex justify-content-between mt-auto">
                <Link
                  className="btn btn-outline-primary btn-sm"
                  to={`/shop/${item.id}`}
                >
                  <FaEye size={24}/>
                </Link>
                {!cartProductIds.some(product => product.id === item.id) ? (
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => dispatch(addToCart(item))}
                  >
                    <FaCartPlus size={24}/>
                  </button>
                ) : (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => dispatch(removeFromCart(item))}
                  >
                    <IoRemoveCircle size={24}/>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="col-12 text-center text-muted">
        <p>...</p>
      </div>
    );

  return (
    <section className="bg-light py-5">
      <div className="container">
        <div className="row">{productCards}</div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
