import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './App.css';

export const theme = {
  fonts: {
    title: "MontserratMedium",
    description: "AvanirBook",
    price: "MontserratRegular",
  },
  sizes: {
    small: "12px",
    medium: "14px",
    large: "15px",
    xLarge: "45px" 
  }
};

const arrowStyle = {
  display: "block",
  borderRadius: "50%", 
  width: "25px",   
  height: "25px",
  zIndex: 2,
};

function NextArrow(props) {
  const { className, onClick } = props;
  return <div className={className} onClick={onClick} style={{ ...arrowStyle, color: "#555" }} />;
}

function PrevArrow(props) {
  const { className, onClick } = props;
  return <div className={className} onClick={onClick} style={{ ...arrowStyle, color: "#555" }} />;
}

function App() {
  const [products, setProducts] = useState([]);
  const [colors, setColors] = useState({});

  useEffect(() => {
    axios.get("https://goldshop-2.onrender.com/products")
      .then(res => {
        setProducts(res.data);
        const initialColors = {};
        res.data.forEach((p, i) => { initialColors[i] = "yellow"; });
        setColors(initialColors);
      })
      .catch(err => console.error(err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1 } },
    ]
  };

  const colorMap = { yellow: "#E6CA97", white: "#D9D9D9", rose: "#E1A4A9" };

  const renderStars = (rating) => {
    const stars = [];
    for(let i = 1; i <= 5; i++) {
      if(rating >= i) stars.push(<FaStar key={i} color="#E6CA97" />);
      else if(rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} color="#E6CA97" />);
      else stars.push(<FaRegStar key={i} color="#E6CA97" />);
    }
    return stars;
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontFamily: theme.fonts.title, fontSize: theme.sizes.xLarge, textAlign:"center" }}>Product List</h1>
      <div className="slider-container">
        <Slider {...settings}>
          {products.map((p, index) => (
            <div key={index} style={{ padding: "0 8px" }}>
              <div className="product-card">
                <img 
                  src={p.images[colors[index]]} 
                  alt={p.name} 
                  className="product-image"
                />
                <h4 className="product-name">{p.name}</h4>
                <p className="product-price">${p.price}</p>
                <div className="color-picker">
                  {Object.entries(colorMap).map(([c, hex]) => (
                    <div
                      key={c}
                      onClick={() => setColors({ ...colors, [index]: c })}
                      style={{
                        backgroundColor: hex,
                        border: colors[index] === c ? "2px solid black" : "1px solid #ccc",
                        borderRadius: "50%",
                        width: "18px",
                        height: "18px",
                        display: "inline-block",
                        marginRight: "5px",
                        cursor: "pointer",
                      }}
                      title={c}
                    ></div>
                  ))}
                  <p className="color-name">{colors[index].charAt(0).toUpperCase() + colors[index].slice(1)} Gold</p>
                </div>
                <div className="rating">
                  {renderStars(parseFloat(p.popularity5))}
                  <span>{p.popularity5} / 5</span>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

     
    </div>
  );
}

export default App;
