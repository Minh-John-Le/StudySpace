import React, { useCallback, useEffect, useState } from "react";
import { createWorker } from "tesseract.js";


const OCRConverter = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textResult, setTextResult] = useState("");

  const worker = createWorker();

  const convertImageToText = useCallback(async () => {
    if (!selectedImage) return;
    const worker = await createWorker('eng');
    const ret = await worker.recognize(selectedImage);
    setTextResult(ret.data.text);
    await worker.terminate();
  }, [worker, selectedImage]);

  useEffect(() => {
    convertImageToText();
  }, [selectedImage, convertImageToText]);

  const handleChangeImage = (e) => {
    if (e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    } else {
      setSelectedImage(null);
      setTextResult("");
    }
  };

  return (
    <div className="App">
      <h1>ImText</h1>
      <p>Gets words in the image!</p>
      <div className="input-wrapper">
        <label htmlFor="upload">Upload Image</label>
        <input
          type="file"
          id="upload"
          accept="image/*"
          onChange={handleChangeImage}
        />
      </div>

      <div className="result">
        {selectedImage && (
          <div className="box-image">
            <img src={URL.createObjectURL(selectedImage)} alt="thumb" />
          </div>
        )}
        {textResult && (
          <div className="box-p">
            <p>{textResult}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OCRConverter;
