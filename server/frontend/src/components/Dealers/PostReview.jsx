import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);
  
  const { id } = useParams();
  const root_url = window.location.href.substring(0, window.location.href.indexOf("postreview"));
  const dealer_url = `${root_url}djangoapp/dealer/${id}`;
  const review_url = `${root_url}djangoapp/add_review`;
  const carmodels_url = `${root_url}djangoapp/get_cars`;

  const get_dealer = useCallback(async () => {
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      const dealerobjs = Array.from(retobj.dealer);
      if(dealerobjs.length > 0) setDealer(dealerobjs[0]);
    }
  }, [dealer_url]);

  const get_cars = useCallback(async () => {
    const res = await fetch(carmodels_url, {
      method: "GET"
    });
    const retobj = await res.json();
    const carmodelsarr = Array.from(retobj.CarModels);
    setCarmodels(carmodelsarr);
  }, [carmodels_url]);

  const postreview = async () => {
    let name = `${sessionStorage.getItem("firstname")} ${sessionStorage.getItem("lastname")}`;
    if(name.includes("null")) {
      name = sessionStorage.getItem("username");
    }
    
    if(!model || review === "" || date === "" || year === "") {
      alert("All details are mandatory");
      return;
    }

    const [make_chosen, model_chosen] = model.split(" ");

    const reviewData = {
      name,
      dealership: id,
      review,
      purchase: true,
      purchase_date: date,
      car_make: make_chosen,
      car_model: model_chosen,
      car_year: year,
    };

    try {
      const res = await fetch(review_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      const json = await res.json();
      if (json.status === 200) {
        window.location.href = `${window.location.origin}/dealer/${id}`;
      }
    } catch (error) {
      console.error('Error posting review:', error);
      alert('Failed to post review. Please try again.');
    }
  };

  useEffect(() => {
    get_dealer();
    get_cars();
  }, [get_dealer, get_cars]);

  return (
    <div>
      <Header/>
      <div style={{margin:"5%"}}>
        <h1 style={{color:"darkblue"}}>{dealer.full_name}</h1>
        <textarea 
          id='review'
          cols='50'
          rows='7'
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className='input_field'>
          Purchase Date 
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className='input_field'>
          Car Make & Model
          <select 
            name="cars" 
            id="cars" 
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="" disabled hidden>Choose Car Make and Model</option>
            {carmodels.map((carmodel, index) => (
              <option 
                key={index} 
                value={`${carmodel.CarMake} ${carmodel.CarModel}`}
              >
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>        
        </div>
        <div className='input_field'>
          Car Year 
          <input 
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            max={2023}
            min={2015}
          />
        </div>
        <div>
          <button className='postreview' onClick={postreview}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;