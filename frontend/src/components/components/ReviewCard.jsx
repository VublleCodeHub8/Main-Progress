import PropTypes from "prop-types";
import "./ReviewCard.css";

function ReviewCard(props) {
  return (
    <div className="ReviewCard">
      <p className="ReviewCard-Para">{props.review}</p>
      <div className="ReviewCard-UserBox">
        <img src={props.avatar} alt="" className="ReviewCard-UserBox-Img" />

        <div>
          <h2 className="ReviewCard-UserBox-UserName">{props.name}</h2>
          <p className="ReviewCard-UserBox-UserJob">{props.job}</p>
        </div>
      </div>
    </div>
  );
}

ReviewCard.propTypes = {
  review: PropTypes.string,
  avatar: PropTypes.string,
  name: PropTypes.string,
  job: PropTypes.string,
};

export default ReviewCard;
