import Chart from '../Chart/Chart';
import './ExchangeChart.scss';

const ExcangeChart = ({ticker, selExchange, excSymbol, priceSymbol, recentPrice, priceDifference, rateDifference, chartWidth, chartData, selRadio, handleRadioClick}) => {

    const selectionBar = () => {
        return ['15M', '1H', '1D', '1W', '1M'].map((el, key) =>  
          <div key={key}>
            <input type="radio" id={el} name={el} value={el} checked={el === selRadio ? true : false} onChange={handleRadioClick}/>
            <label htmlFor={el}>{el}</label>
          </div>
      )};

    return (
        <div className="chart-container">
            <div className="chart-info-bar">
                <div className="left-info">
                    <div className="flags-container">
                        <div className="center-cropped"
                            style={{backgroundImage: `url('https://wise.com/public-resources/assets/flags/rectangle/${ticker.slice(0, 3).toLowerCase()}.png')`}}></div>

                        <div className="center-cropped"
                            style={{backgroundImage: `url('https://wise.com/public-resources/assets/flags/rectangle/${ticker.slice(3).toLowerCase()}.png')`}}></div>
                        
                        <div className="forex">
                            {selExchange ? (selExchange.charAt(0) + selExchange.toLowerCase().slice(1)) : 'Forex.com'}
                        </div>
                    </div>

                    <div className='exchanges'>{excSymbol}</div>
                </div>

                <div className="right-info">
                    <div className="price-diff">
                        {new Intl.NumberFormat('EN-US', { style: 'currency', currency: priceSymbol }).formatToParts(recentPrice).map(val => val.value).join('')}
                    </div>

                    <div className={`rate-diff ${priceDifference >= 0  ? 'green' : 'red'}`}>
                        {`${priceDifference > 0 ? '▲ +' + priceDifference 
                                                : priceDifference < 0 
                                                ? '▼' + priceDifference
                                                : priceDifference} (${rateDifference > 0 ? '+' + rateDifference : rateDifference}%)`}
                    </div>
                </div>
            </div>

            <div id='chart-parent' >
                {chartData ? (
                    <Chart
                        data={chartData}
                        svgWidth={chartWidth}
                    />
                ) : null}
            </div>

            <div className="radio-toolbar">
                {selectionBar()}
            </div>
        </div>
    )
};

export default ExcangeChart;