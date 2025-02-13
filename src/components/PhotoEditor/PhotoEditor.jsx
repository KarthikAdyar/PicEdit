import React, { useState, useEffect, useRef } from "react";
import SimpleMeter from "../Simple/SimpleMeter";
import { filterValues } from "../../utils/utils";
import "./photoeditor.scss";

const PhotoEditor = () => {
  const [image, setImage] = useState(null);
  const [imageStyles, setImageStyles] = useState({});

  const imageHandler = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const [value, setValue] = useState(0);
  const meterRef = useRef(null);
  const buttonRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;

      const meterRect = meterRef.current.getBoundingClientRect();
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const maxButtonPosition = meterRect.width - buttonRect.width / 2;
      const minButtonPosition = -buttonRect.width / 2;
      let buttonPosition = e.clientX - meterRect.left;

      buttonPosition = Math.max(
        minButtonPosition,
        Math.min(buttonPosition, maxButtonPosition)
      );

      buttonRef.current.style.left = `${
        buttonPosition + buttonRect.width / 2
      }px`;

      const newValue = Math.round(
        ((buttonPosition + buttonRect.width / 2) / meterRect.width) * 100
      );
      setImageStyles({ opacity: `${newValue}%` });
      setValue(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  console.log(imageStyles)

  return (
    <div className="main-content">
      <h1 className="title">Photo Editor</h1>
      <div className="image-container">
        <img
          style={imageStyles}
          src={image}
          width="500"
          height="500"
          alt="Upload your image here"
        />
        <input type="file" accept="image/*" onChange={imageHandler} />
        <div className="meter" ref={meterRef}>
          <div
            className="draggable-button"
            ref={buttonRef}
            onMouseDown={handleMouseDown}
            style={{ left: `${value}%` }}
          ></div>
        </div>
      </div>

      <div className="adjust-settings">
        {filterValues?.map(item => {
          let initialValue = 100;

          if(item !== 'opacity'){
            initialValue = 0
          }
          return <SimpleMeter 
            key={item}
            initialValue={initialValue}
            meterName={item}
            setImageStyles={setImageStyles}
            imageStyles={imageStyles}
          />
        })}
      </div>
    </div>
  );
};

export default PhotoEditor;
