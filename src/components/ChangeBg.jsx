import { useLayoutEffect, useState } from "react";

const Changebg = () => {
  const [color, setColor] = useState('lightblue');

  // DOM manipulation: background color change on state update
  useLayoutEffect(() => {
    document.body.style.backgroundColor = color;
  }, [color]);

  return (
    <>
      <p>{color}</p>
      <button onClick={() => setColor('green')}>Color 1</button>
      <button onClick={() => setColor('yellow')}>Color 2</button>
    </>
  );
};

export default Changebg;
