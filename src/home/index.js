import React, { useState, useEffect } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import ExcahangeChart from '../components/ExchangeChart/ExchangeChart';
import RequestParams from '../modal/RequestParams';
import './home.scss';

const Home = () => {
  const [chartData, setChartData] = useState(null);
  const [chartWidth, setChartWidth] = useState();
  const [selRadio, setSelRadio] = useState('1M');
  const [exchangeList, setExchangeList] = useState([]);
  const [symbolList, setSymbolList] = useState([]);
  const [selExchange, setExchange] = useState();
  const [hasSymbolDataFetched, setSymbolDataFetched] = useState(true);
  const [priceDifference, setPriceDifference] = useState();
  const [rateDifference, setRateDifference] = useState();
  const [recentPrice, setRecentPrice] = useState();
  const [excSymbol, setExcSymbol] = useState('USD/EUR');
  const [priceSymbol, setPriceSymbol] = useState('EUR');
  const [ticker, setTicker] = useState('USDEUR')

  useEffect( () => {
    callFinnhubApi('exchange');

    handleResize();
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, []);

  useEffect( () => {
    getTickerAggregate(selRadio);
  }, [ticker]);

  useEffect( () => {
    if (selExchange)
      callFinnhubApi('symbol');
  }, [selExchange]);

  const getTickerAggregate = (symb) => {
      // const url = `https://api.polygon.io/v2/aggs/ticker/C:${ticker}/range/${RequestParams[symb].multiplier}/${RequestParams[symb].timespan}/${RequestParams[symb].from}/${RequestParams[symb].to}?adjusted=true&sort=asc&limit=${RequestParams[symb].limit}&apiKey=OCpAvGhPAOvEYXBrSdqcJfje0LF7RmPd`;
      const url = `https://api.finage.co.uk/agg/forex/${ticker}/${RequestParams[symb].multiplier}/${RequestParams[symb].timespan}/${RequestParams[symb].from}/${RequestParams[symb].to}?apikey=API_KEYf5OPKEEXCWTUDZA13RNF5U2850QRXTZV`
    
    fetch(url)
      .then((r) => r.json())
      .then((pData) => {
        console.log("pData: ", pData)
        const closingDataArr = pData.results.map(el => el.c)
        const priceDiff = (closingDataArr[closingDataArr.length-1] - closingDataArr[0]).toFixed(2);
        const diffRate = ((priceDiff * 100) / closingDataArr[0]).toFixed(2);

        setPriceDifference(priceDiff);
        setRateDifference(diffRate);
        setRecentPrice(closingDataArr[closingDataArr.length-1]);
        setChartData(sortData(closingDataArr))
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const callFinnhubApi = (type) => {
    const finnhub = require('finnhub');

    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = "cadj6kaad3i5theg22ug";
    const finnhubClient = new finnhub.DefaultApi();

    if (type === "exchange") {
      finnhubClient.forexExchanges((error, data, response) => {
        setExchangeList(data.map(el => el.toUpperCase()));
      });
    } else if (type === "symbol") {
      console.log("selExchange: ", selExchange)
      const exchange = selExchange ? selExchange : 'FOREX.COM'
      finnhubClient.forexSymbols(exchange, (error, data, response) => {
        setSymbolList(data.filter(el => el.displaySymbol.length === 7))
        setSymbolDataFetched(false);
        console.log("symbolssssss")
      });
    }
  };

  function handleResize() {
    setChartWidth(document.getElementById('chart-parent').clientWidth);
  }

  const handleExchangeSelection = (e) => {
    console.log("exc val: ", e.target.value);
    setExchange(e.target.value)
  };

  const handleSymbolSelection = (e) => {
    const val = e.target.value.slice(0, 7);
    setExcSymbol(val)
    setPriceSymbol(val.replace('/', '').slice(3))
    setTicker(val.replace('/', ''))
  };

  const handleRadioClick = (e) => {
    setSelRadio(e.target.value)
    getTickerAggregate(e.target.value);
  };

  const sortData = (dataArr) => {
    const sortedData = [];
    for (let i = 0; i < dataArr.length; i++){
      sortedData.push({
        x: i, //previous days
        y: dataArr[i],
      });
    }
    
    return sortedData;
  };

  return (
    <div className="container">
      <div className='forex-title'>
        <h1>Forex Exchange</h1>
      </div>
      <div className='mb-5'>
        <h6>Checkout the current price on different exchanges for a currency pair</h6>
      </div>

      <Container fluid="xs">
        <Row className='align-items-center'>
          <Col className="select-container" sm="auto" md="auto" lg="auto" xl="auto">
            <div className='pb-4'>
              <select onChange={handleExchangeSelection}>
                <option hidden>Select Exchange</option>
                {exchangeList && exchangeList.map((el, key) => <option key={key}>{el}</option>)}
              </select>
            </div>
            <div className='pb-4'>
              <select onChange={handleSymbolSelection} disabled={hasSymbolDataFetched}>
                <option id="symbol-select" hidden>Select Symbol</option>
                {symbolList && symbolList.map((el, key) => <option key={key}>{el.displaySymbol}</option>)}
              </select>
            </div>
          </Col>
          <Col sm="12" md="12" lg="8" xl="8" >
            <ExcahangeChart 
              ticker={ticker}
              selExchange={selExchange}
              excSymbol={excSymbol} 
              priceSymbol={priceSymbol}
              recentPrice={recentPrice} 
              priceDifference={priceDifference}
              rateDifference={rateDifference}
              chartData={chartData}
              chartWidth={chartWidth}
              selRadio={selRadio}
              handleRadioClick={handleRadioClick}
            />
          </Col>
        </Row>
      </Container>

    </div>
  );
};

export default Home;
