import './App.css';
import { search, cleanData } from './axios';
import React, { useState, useEffect } from 'react';

function App() {
  const [prdsList, setPrdsList] = useState([]);
  const [prdName, setPrdName] = useState("");
  const [page, setPage] = useState(1);
  const [type, setType] = useState("momo");
  const [searchClicked, setSearchClicked] = useState(false);
  let Name, Type;


  const handleSearch = async (Name, Page, Type, click) => {
    if (Name !== undefined)
      setPrdName(Name);
    else 
      Name = prdName;
    if (Type !== undefined)
      setType(Type);
    else
      Type = type;
    setPage(Page);

    const prds = await search(Name, page, Type);
    setPrdsList(prds);
    // console.log(prdsList); //check
    if (!searchClicked)
      setSearchClicked(click);
  };

  const handlePrevButtonClick = () => {
    setPage(page - 1);
  };

  const handleNextButtonClick = () => {
    setPage(page + 1);
  };

  const handlePageButtonClick = (event) => {
    setPage(parseInt(event.currentTarget.value));
  }

  const handlePageIndex = () => {
    if (page < 3) {
      return (
        <div className="page-select">
          {[1, 2, 3, 4, 5].map((index) => (
            <button 
              className={index === page ? 'selected' : 'page-button'} 
              key={index} 
              value={index} 
              onClick={index === page ? () => {} : handlePageButtonClick}
            >{index}</button>
          ))}
        </div>
      )
    }
    else {
      return (
        <div className="page-select">
          {[page-2, page-1, page, page+1, page+2].map((index) => (
            <button 
              className={index === page ? 'selected' : 'page-button'} 
              key={index} 
              value={index} 
              onClick={index === page ? () => {} : handlePageButtonClick}
            >{index}</button>
          ))}
        </div>
      )
    }
  }

  const UpdateProducts = () => {
    try {
      return (
        <div>
          <div className='App-main'>{prdsList.map(element => (
              <div key={element.id} className="prds" >
                <img src={element.pic} alt={element.id} key={element.id} className='prdsPic' />
                <div className="info">
                  <p className="info_name">{element.name}</p>
                  <div className='info_more'>
                    <p className="info_price">{element.price}</p>
                    <a href={element.link}><button>點擊前往</button></a>
                  </div>
                </div>
              </div>
          ))}
          </div>
          {searchClicked && (
            <div className='buttonBelow'>
              <button className="prev-button" onClick={handlePrevButtonClick}>prev page</button>
              {handlePageIndex()}
              <button className="next-button" onClick={handleNextButtonClick}>next page</button>
            </div>
          )}
        </div>
      );
    }
    catch{
      return <p></p>
    }
    // else 
    //   return <div></div>
  }

  useEffect(() => {
    cleanData();
  }, [type]);

  useEffect(() => {
    handleSearch(prdName, page, type);
    UpdateProducts();
    window.scrollTo(0, 0); // scroll to the top of the page
  }, [page]);

  return (
    <div className="App">
      <div className='App-header'>
        <select name="type" className="product-type" onChange={event => {Type = event.target.value}}>
          <option value="momo">momo</option>
          <option value="pchome">pchome</option>
          <option value="shopee">shopee</option>
        </select>
        <input type="text" className="search-input" value={Name} onChange={event => {Name = event.target.value}}></input>
        <button className="search-button" onClick={() => handleSearch(Name, 1, Type, true)}>search</button>
        <button className="prev-button" onClick={handlePrevButtonClick}>prev page</button>
        <button className="next-button" onClick={handleNextButtonClick}>next page</button>
        <UpdateProducts />
      </div>
    </div>
  );
}

export default App;
