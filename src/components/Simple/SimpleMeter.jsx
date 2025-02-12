import { useState, useRef, useEffect } from "react";
import { commonConstants } from "../../utils/utils";

const SimpleMeter = ({
  initialValue = 0,
  onChange,
  meterName,
  setImageStyles,
  imageStyles,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    if (onChange) {
      onChange(value);
    }
  }, [value, onChange]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
  };

  const setFilter = (meterName , meterValue) => {
    const filterStringIndex = imageStyles.filter?.indexOf(meterName)

    if(meterName === commonConstants.opacity){
        meterValue = (meterValue * 0.01).toFixed(1)
    }

    if(filterStringIndex > -1){
        return imageStyles.filter.slice(0 , filterStringIndex) + `${meterName}(${meterValue})` + imageStyles.filter.slice(filterStringIndex+meterName.length+meterValue.toString().length+2)
    }
    else {
        return `${meterName}(${meterValue})`
    }

  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      const trackRect = trackRef.current.getBoundingClientRect();
      const newPosition = e.clientX - trackRect.left; // Directly use clientX

      let newValue = Math.round((newPosition / trackRect.width) * 100); // 0-100 range

      newValue = Math.max(0, Math.min(100, newValue)); // Clamp to 0-100
      setImageStyles({
        filter: setFilter(meterName , newValue),
      });
      setValue(newValue);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleTrackClick = (e) => {
    const trackRect = trackRef.current.getBoundingClientRect();
    const newPosition = e.clientX - trackRect.left;
    let newValue = Math.round((newPosition / trackRect.width) * 100);
    newValue = Math.max(0, Math.min(100, newValue));
    setImageStyles({
      filter: setFilter(meterName , newValue),
    });
    setValue(newValue);
  };

  const meterStyle = {
    position: "absolute",
    top: "50%",
    left: `${value}%`, // Directly use percentage
    transform: "translateX(-50%) translateY(-50%)", // Center
    width: "20px", // Smaller meter
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "blue",
    cursor: "grab",
  };

  const trackStyle = {
    position: "relative",
    width: "200px",
    height: "10px",
    backgroundColor: "lightgray",
    borderRadius: "5px",
    cursor: "grab",
  };

  const progressStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${value}%`,
    backgroundColor: "green",
    borderRadius: "5px",
  };

  return (
    <>
      <div
        style={trackStyle}
        ref={trackRef}
        onClick={handleTrackClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div style={progressStyle}></div>
        <div style={meterStyle} />
      </div>
      <p>
        {meterName}: {value}
      </p>
    </>
  );
};

export default SimpleMeter;
