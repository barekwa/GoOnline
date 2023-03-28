import React, { useState } from 'react';

type Color = {
  name: string;
  hex: string;
}

type ColorFormProps = {
  onAddColor: (color: Color) => void;
}

const ColorForm = ({ onAddColor }: ColorFormProps) => {
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('');

  const handleColorNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColorName(event.target.value);
  }

  const handleColorHexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputHex = event.target.value;
    const validHexRegex = /^#?([A-Fa-f0-9]|[A-Fa-f0-9]{0,})$/;
  
    if (inputHex.length === 1) {
      if (inputHex === "#") {
        setColorHex(inputHex);
      } else {
        setColorHex("");
      }
    } else {
      if (validHexRegex.test(inputHex)) {
        setColorHex(inputHex.toUpperCase());
        if(inputHex.length > 0 && inputHex.length < 7 && inputHex.length !== 4){
          let lng = inputHex.length > 4 ? 7 : 4;
          event.target.setCustomValidity(`Wydłuż ten tekst do ${lng} znaków teraz używasz ${inputHex.length} znaków`);
        } else {
          event.target.setCustomValidity('');
        }
      }
    }
  };
  const fixHexCode = (color: Color): Color => {
    const match = color.hex.match(/^#?([a-f\d])([a-f\d])([a-f\d])$/i);
    if (match) {
      color.hex=`#${match[1]}${match[1]}${match[2]}${match[2]}${match[3]}${match[3]}`;
      return color;
    } else {
      return color;
    }
  };
  
  const addColorToLocalStorage = (color: Color) => {
    const hexValue = color.hex.replace("#", "");
    const decimalValue = parseInt(hexValue, 16);
    if (decimalValue >= 0 && decimalValue <= 16777215) {
      fixHexCode(color);
      const colors = localStorage.getItem("colors");
      const colorsArray = colors ? JSON.parse(colors) : [];
      colorsArray.push(color);
      localStorage.setItem("colors", JSON.stringify(colorsArray));
    } else {
      console.log("Nieprawidłowy kolor");
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newColor: Color = { name: colorName, hex: colorHex };
    onAddColor(newColor);
    addColorToLocalStorage(newColor);
    setColorName('');
    setColorHex('');
    //window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Color name:
        <input type="text" value={colorName} onChange={handleColorNameChange} required />
      </label>
      <br/>
      <label>
        Color hex:
        <input type="text" value={colorHex} onChange={handleColorHexChange} minLength={4} maxLength={7} required />
      </label>
      <br/>
      <button type="submit">Add color</button>
    </form>
  );
}

export default ColorForm;
