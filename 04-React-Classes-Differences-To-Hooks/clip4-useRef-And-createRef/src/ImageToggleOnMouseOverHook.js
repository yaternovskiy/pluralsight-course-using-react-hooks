import React, { useRef } from "react";

const ImageToggleOnMouseOverHook = ({ primaryImg, secondaryImg }) => {
  // const imageRef = useRef(null);

  return (
    <div>
      <i>ImageToggleOnMouseOver - Functional Component React Hooks</i><br/>
      <img
        onMouseOver={(e) => {
          e.target.src = secondaryImg;
          // imageRef.current.src = secondaryImg;
        }}
        onMouseOut={(e) => {
          e.target.src = primaryImg;
          // imageRef.current.src = primaryImg;
        }}
        src={primaryImg}
        alt=""
        // ref={imageRef}
      />
    </div>
  );
};

export default ImageToggleOnMouseOverHook;
