import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);
  
  const { id } = useParams();
  const root_url = window.location.href.substring(0, window.location.href.indexOf("dealer"));

  const get_dealer = useCallback(async () => {
    const dealer_url = `${root_url}djangoapp/dealer/${id}`;
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      // Just set the dealer object directly
      setDealer(retobj.dealer);
    }
  }, [id, root_url]);

  const get_reviews = useCallback(async () => {
    const reviews_url = `${root_url}djangoapp/reviews/dealer/${id}`;
    const res = await fetch(reviews_url, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      if(retobj.reviews.length > 0) {
        setReviews(retobj.reviews);
      } else {
        setUnreviewed(true);
      }
    }
  }, [id, root_url]);

  const senti_icon = useCallback((sentiment) => {
    return sentiment === "positive" 
      ? positive_icon 
      : sentiment === "negative" 
        ? negative_icon 
        : neutral_icon;
  }, []);

  useEffect(() => {
    get_dealer();
    get_reviews();
    if(sessionStorage.getItem("username")) {
      setPostReview(
        <a href={`${root_url}postreview/${id}`}>
          <img 
            src={review_icon} 
            style={{width:'10%', marginLeft:'10px', marginTop:'10px'}} 
            alt='Post Review'
          />
        </a>
      );
    }
  }, [get_dealer, get_reviews, id, root_url]);

  return (
    <div style={{margin:"20px"}}>
      <Header/>
      <div style={{marginTop:"10px"}}>
        <h1 style={{color:"grey"}}>
          {dealer.full_name}
          {postReview}
        </h1>
        <h4 style={{color:"grey"}}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && !unreviewed ? (
          <text>Loading Reviews....</text>
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div key={index} className='review_panel'>
              <img 
                src={senti_icon(review.sentiment)} 
                className="emotion_icon" 
                alt='Sentiment'
              />
              <div className='review'>{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;