import { useLayoutEffect, useState } from "react";

const ChangeText = () => {
  const [color , setColor] = useState('lightblue');

  useLayoutEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);

  return (
    <>
    <h1 onClick={() => setColor('green')}>hello</h1>
      <p>{color} </p>
      
    </>
  );
};

export default ChangeText;