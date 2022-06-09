import './Chart.scss';

const Chart = (props) => {
  const { svgHeight, svgWidth } = props;

  // GET X & Y || MAX & MIN
  const getX = () => {
    const { data } = props;
    return {
      min: data[0].x,
      max: data[data.length - 1].x,
    };
  };

  const getY = () => {
    const { data } = props;
    return {
      min: data.reduce((min, p) => (p.y < min ? p.y : min), data[0].y)*0.9,
      max: Math.ceil(data.reduce((max, p) => (p.y > max ? p.y : max), data[0].y)),
    };
  };

  // GET SVG COORDINATES
  const getSvgX = (x) => {
    const { svgWidth } = props;
    return (x / getX().max) * svgWidth;
  };

  const getSvgY = (y) => {
    const { svgHeight } = props;
    const gY = getY();
    return (
      (svgHeight * gY.max - svgHeight * y) /
      (gY.max - gY.min)
    );
  };

  // BUILD SVG PATH
  const makePath = () => {
    const { data, color } = props;
    let pathD = 'M ' + getSvgX(data[0].x) + ' ' + getSvgY(data[0].y) + ' ';

    pathD += data
      .map((point, i) => {
        return 'L ' + getSvgX(point.x) + ' ' + getSvgY(point.y) + ' ';
      })
      .join('');

    return (
      <path className='linechart_path' d={pathD} style={{ stroke: color }} />
    );
  };

  // BUILD SHADED AREA
  const makeArea = () => {
    const { data } = props;
    let pathD = 'M ' + getSvgX(data[0].x) + ' ' + getSvgY(data[0].y) + ' ';

    pathD += data
      .map((point, i) => {
        return 'L ' + getSvgX(point.x) + ' ' + getSvgY(point.y) + ' ';
      })
      .join('');

    const x = getX();
    const y = getY();
    pathD +=
      'L ' +
      getSvgX(x.max) +
      ' ' +
      getSvgY(y.min) +
      ' ' +
      'L ' +
      getSvgX(x.min) +
      ' ' +
      getSvgY(y.min) +
      ' ';

    return <path className='linechart_area' d={pathD} />;
  };

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className={'linechart'}
    >
      <g>
        {makePath()}
        {makeArea()}
      </g>
    </svg>
  );
};

Chart.defaultProps = {
  data: [],
  color: '#6bba4c',
  svgHeight: 200,
  svgWidth: 900,
};

export default Chart;
