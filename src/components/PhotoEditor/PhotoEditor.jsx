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
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.filter = imageStyles.filter;

      ctx.drawImage(image, 0, 0);

      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${fileName ? fileName : 'edited-image'}.png`;
      link.click();
    };
  }

  const changeFileName = (e) => {
    setFileName(e.target.value)
  }

  return (
    <>
     <h1 className="title">
         Edit Pic Fast
      </h1>
      {image && <div className="flex-justify">
        <label htmlFor="files" className="input-styles">Choose File</label>
        <div>
          <input type="text" className="file-save-input" placeholder="File Name" value={fileName} onChange={changeFileName}/>
          <button className="save-button" onClick={saveImage}>Save</button>
        </div>
        
        </div>}
      
    <div className={image ? "parent": ""}>
      <div className={image ? "image-container": "no-image"}>
        {!image ? 
         <h2 className="upload-image-text">Please Upload the image</h2>: 
         <img
         style={imageStyles}
         src={image}
         width="500"
         height="500"
         alt="Upload your image here"
         ref={imageRef}
       />
         }
        <input style={{display:'none'}} type="file" accept="image/*" onChange={imageHandler} id="files" />
        {!image ? <label htmlFor="files" className="input-styles">Choose File</label> : ''}
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
