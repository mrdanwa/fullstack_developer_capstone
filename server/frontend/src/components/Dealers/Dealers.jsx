import React, { useState, useEffect, useCallback } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [states, setStates] = useState([]);

  const get_dealers = useCallback(async () => {
    const dealer_url = "/djangoapp/get_dealers";
    const res = await fetch(dealer_url, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      const all_dealers = Array.from(retobj.dealers);
      const uniqueStates = [...new Set(all_dealers.map(dealer => dealer.state))];
      setStates(uniqueStates);
      setDealersList(all_dealers);
    }
  }, []);

  const filterDealers = useCallback(async (state) => {
    if (state === "All") {
      get_dealers();
      return;
    }
    const dealer_url_by_state = `/djangoapp/get_dealers/${state}`;
    const res = await fetch(dealer_url_by_state, {
      method: "GET"
    });
    const retobj = await res.json();
    if(retobj.status === 200) {
      const state_dealers = Array.from(retobj.dealers);
      setDealersList(state_dealers);
    }
  }, [get_dealers]);

  useEffect(() => {
    get_dealers();
  }, [get_dealers]);

  const isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div>
      <Header/>
      <table className='table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select 
                name="state" 
                id="state" 
                onChange={(e) => filterDealers(e.target.value)}
              >
                <option value="" disabled hidden>State</option>
                <option value="All">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </th>
            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>
        <tbody>
          {dealersList.map(dealer => (
            <tr key={dealer.id}>
              <td>{dealer.id}</td>
              <td>
                <a href={`/dealer/${dealer.id}`}>{dealer.full_name}</a>
              </td>
              <td>{dealer.city}</td>
              <td>{dealer.address}</td>
              <td>{dealer.zip}</td>
              <td>{dealer.state}</td>
              {isLoggedIn && (
                <td>
                  <a href={`/postreview/${dealer.id}`}>
                    <img src={review_icon} className="review_icon" alt="Post Review"/>
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;