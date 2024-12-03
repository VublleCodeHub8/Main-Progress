import PropTypes from "prop-types";
import "./FeaturesCard.css";

function FeaturesCard(props) {
  return (
    <div className="FeaturesCard">
      <img src={props.img} alt="" className="FeaturesCard-Img" />
      <h2 className="FeaturesCard-Title">{props.title}</h2>
      <p className="FeaturesCard-Para">{props.desc}</p>
    </div>
  );
}

FeaturesCard.propTypes = {
  img: PropTypes.string,
  title: PropTypes.string,
  desc: PropTypes.string,
};

export default FeaturesCard;
