import React, { useState, useEffect, useRef } from "react";
import SimpleMeter from "../Simple/SimpleMeter";
import { commonConstants, filterValues } from "../../utils/utils";
import "./photoeditor.scss";

const PhotoEditor = () => {
  const [image, setImage] = useState(null);
  const [imageStyles, setImageStyles] = useState({});
  const [value, setValue] = useState(0);
  const meterRef = useRef(null);
  const buttonRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef(null);
  const [fileName , setFileName] = useState('')

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

  const imageHandler = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const saveImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = imageRef.current.src
    image.onload = () => {
      // Set canvas size to the image size
      canvas.width = image.width;
      canvas.height = image.height;

      // Apply the filter to the canvas context
      ctx.filter = imageStyles.filter;

      // Draw the image onto the canvas
      ctx.drawImage(image, 0, 0);

      // Convert canvas to a data URL (Base64 image)
      const dataUrl = canvas.toDataURL('image/png');

      // Create a link and trigger the download
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${fileName ? fileName : 'edited-image'}.png`;
      link.click();
    };
  }

  const changeFileName = (e) => {
    if(e.target.value){
      setFileName(e.target.value)
    }
  }

  return (
    <>
     <h1 className="title">
         Edit Pic Fast
      </h1>
    <div class="parent">
      <div className="image-container">
        {!image ? 
         <p>Please Upload the image</p>: 
         <img
         style={imageStyles}
         src={image}
         width="500"
         height="500"
         alt="Upload your image here"
         ref={imageRef}
       />
         }
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
      {image ? <div className="adjust-settings">
        {filterValues?.map(item => {
          let initialValue = 0;

          if(item === commonConstants.opacity){
            initialValue = 100
          }

          if(item === commonConstants.brightness || item === commonConstants.contrast || item === commonConstants.saturate){
            initialValue = 50
          }

          
          return <SimpleMeter 
            key={item}
            initialValue={initialValue}
            meterName={item}
            setImageStyles={setImageStyles}
            imageStyles={imageStyles}
          />
        })}
        
      </div> : <></>}
    </div>
    </>
  );
};

export default PhotoEditor;
