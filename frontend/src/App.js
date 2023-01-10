import './App.css';
import { search, cleanData } from './axios';
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import { Button, Select, Input } from 'antd';

function App() {
  const [prdsList, setPrdsList] = useState([]);
  const [prdName, setPrdName] = useState("");
  const [page, setPage] = useState(1);
  const [type, setType] = useState(["momo"]);
  const [searchClicked, setSearchClicked] = useState(false);
  const [searchtype, setSearchType] = useState("default");
  const [loading, setLoading] = useState(false);
  const [selectSearch, setSelectSearch] = useState(false);
  // const [typeList, setTypeList] = useState([])
  let Name, Type, SearchType;

  const handleSearch = async (Name, Page, Type, SearchType, click) => {
    setLoading(true);
    if (Name !== undefined)
      setPrdName(Name);
    else 
      Name = prdName;

    if (Type !== undefined && Type !== type)
      setType(Type);
    else {
        Type = type;
    }

    if (SearchType !== undefined)
      setSearchType(SearchType);
    else
      SearchType = searchtype;
    
    setPage(Page);

    const prds = await search(Name, page, Type, SearchType);
    setPrdsList(prds);
    setLoading(false);
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
                    <a href={element.link}><Button>點擊前往</Button></a>
                  </div>
                </div>
              </div>
          ))}
          </div>
          {searchClicked && (
            <div className='buttonBelow'>
              <Button className="prev-button" onClick={handlePrevButtonClick}>prev page</Button>
              {handlePageIndex()}
              <Button className="next-button" onClick={handleNextButtonClick}>next page</Button>
            </div>
          )}
        </div>
      );
    }
    catch{
      return <p></p>
    }
  }

  const Loader = () => {
    return (
      <div className="loading">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Please wait for a moment</p>
      </div>
    );
  };

  const handleSearchTypeButtonClick = (value) => {
    SearchType = value;
    if (Type !== undefined && Type !== type)
      setType(Type);
    else
      Type = [type[0]]
    if (SearchType !== undefined)
      setSearchType(SearchType);
    else
      SearchType = searchtype;
    if (SearchType !== "default")

      setSelectSearch(true);
    else
      setSelectSearch(false)
  }

  const SglSelectType = () => {
    if (Type !== undefined) {
      return Type[0]
    }
    else {
      return type[0]
    }
  }

  const handleSglChange = (value) => {
    if (value !== undefined)
      Type = [value];
      // console.log(`check: ${Type}`)
  }

  const SglSelectSearch = () => {
    return (
      <Select 
        name="type" 
        className="product-type" 
        defaultValue={SglSelectType} 
        onChange={handleSglChange} 
        options={[
          { value: 'momo', label: 'momo' },
          { value: 'pchome', label: 'pchome' },
          { value: 'shopee', label: 'shopee' }]} 
        />
    );
  };

  const MulSelectType = (value) => {
    if (type.includes(value)) {
      Type = type;
      return true;
    }
    else {
      return false
    }
  }

  const MulSelectSearch = () => {
    return (
      <div className='select-search product-type'>
        <div>
          <input type="checkbox" id="momo" value="momo" defaultChecked={MulSelectType("momo")} onChange={handleCheckboxChange} />
          <label htmlFor="momo">momo</label>
        </div>
        <div>
          <input type="checkbox" id="pchome" value="pchome" defaultChecked={MulSelectType("pchome")} onChange={handleCheckboxChange} />
          <label htmlFor="pchome">pchome</label>
        </div>
        <div>
          <input type="checkbox" id="shopee" value="shopee" defaultChecked={MulSelectType("shopee")} onChange={handleCheckboxChange} />
          <label htmlFor="shopee">shopee</label>
        </div>
      </div>
    );
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    console.log(Type)
    if (Type === undefined)
      Type = [];
    console.log(Type)
    const index = Type.indexOf(value);
    if (index !== -1) {
      Type.splice(index, 1);
    } else {
      Type.push(value);
    }
  }

  const handleInputChange = (event) => {
    Name = event.target.value;
  }
  

  // useEffect(() => {
  //   cleanData("all");
  // }, [type, searchtype]);

  useEffect(() => {
    handleSearch(prdName, page, type, searchtype);
    UpdateProducts();
    window.scrollTo(0, 0); // scroll to the top of the page
  }, [page]);

  return (
    <div className="App">
      <div className='App-header'>
        <Select
          name="type" 
          className="search-type" 
          defaultValue="default"
          onChange={handleSearchTypeButtonClick} 
          options={[
            { value: "default", label: "default" },
            { value: "low-high", label: "low-high" },
            { value: "high-low", label: "high-low" },
          ]} />
        {selectSearch?
          <MulSelectSearch />:
          <SglSelectSearch />
        }
        {/* <input type="text" className="search-input" value={Name} onChange={event => {Name = event.target.value}}></input> */}
        <Input className="search-input" value={Name} onChange={handleInputChange} />
        <Button className="search-button" onClick={() => handleSearch(Name, 1, Type, SearchType, true)}>search</Button>
        <Button className="prev-button" onClick={handlePrevButtonClick}>prev page</Button>
        <Button className="next-button" onClick={handleNextButtonClick}>next page</Button>
      </div>
      <div className='App-main'>
        {loading?
          <Loader />:
          <UpdateProducts />
        }
      </div>
    </div>
  );
}

export default App;
