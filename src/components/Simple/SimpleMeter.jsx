import { useState, useRef, useEffect } from "react";
import { commonConstants } from "../../utils/utils";

const SimpleMeter = ({
  initialValue = 0,
  onChange,
  meterName,
  setImageStyles,
  imageStyles,
  meterSize
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

  const setFilter = (meterName , meterValue , oldValue) => {
    const filterStringIndex = imageStyles.filter?.indexOf(meterName)

    let offsetValueForSlice = oldValue?.toString().length - meterValue?.toString().length
    let isGreater = meterValue?.toString().length > oldValue?.toString().length

    if(meterName === commonConstants.contrast){
      isGreater = (meterValue*2)?.toString().length > (oldValue*2)?.toString().length
    }
   
    if(meterName === commonConstants.opacity || meterName === commonConstants.invert){
        meterValue = `(${(meterValue * 0.01).toFixed(1)})`
    }
    else if(meterName === commonConstants.brightness){
        meterValue = `(${(meterValue * 2 * 0.01).toFixed(1)})`
    }
    else if(meterName === commonConstants.blur){
        meterValue = `(${meterValue}px)`
    } 
    else if(meterName === commonConstants.grayscale  || meterName === commonConstants.sepia){
      meterValue = `(${meterValue}%)`
    }
    else if(meterName === commonConstants.hueRotate){
      meterValue = `(${meterValue}deg)`
    }
    else if(meterName === commonConstants.contrast || meterName === commonConstants.saturate){
      meterValue = `(${2* meterValue}%)`
    }

    let sliceValuePost = filterStringIndex + meterName.length+meterValue.toString().length + offsetValueForSlice

    if(imageStyles.filter?.[sliceValuePost] === ')'){
      sliceValuePost++;
    }

    if(isGreater && commonConstants.contrast){
      sliceValuePost = sliceValuePost -  offsetValueForSlice - 1
    }
   
    if(filterStringIndex > -1){
        return imageStyles.filter.slice(0 , filterStringIndex) + `${meterName}${meterValue}${isGreater ? " ":''}` + imageStyles.filter.slice(sliceValuePost)
    }
   
    return imageStyles.filter === undefined ? `${meterName}${meterValue}` : imageStyles.filter + ` ${meterName}${meterValue}`
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      const trackRect = trackRef.current.getBoundingClientRect();
      const newPosition = e.clientX - trackRect.left; 

      let newValue = Math.round((newPosition / trackRect.width) * 100); 

      newValue = Math.max(0, Math.min(100, newValue));
      setImageStyles({
        ...imageStyles,
        filter: setFilter(meterName , newValue , value)
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
        ...imageStyles,
        filter: setFilter(meterName , newValue , value)
    });
    setValue(newValue);
  };

  const meterStyle = {
    position: "absolute",
    top: "50%",
    left: `${value}%`,
    transform: "translateX(-50%) translateY(-50%)",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "rgb(38 38 116)",
    cursor: "grab",
  };

  const trackStyle = {
    position: "relative",
    height: "30px",
    backgroundColor: "lightgray",
    borderRadius: "40px",
    cursor: "grab",
  };

  const progressStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${value}%`,
    backgroundColor: "rgb(38 38 116)",
    borderRadius: "40px",
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
